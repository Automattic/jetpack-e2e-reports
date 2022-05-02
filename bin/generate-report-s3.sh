#!/usr/bin/env bash

# Required:
# - RESULTS_PATH: Path to the test output directory
# - REPORT_ID: The id of the report. This can be a branch name, a pull request number, or any other name

set -eo pipefail

# Test Allure installation
allure --version

# Check that Allure results directory exists
if [[ -z "$RESULTS_PATH" ]]; then
  echo "::error::RESULTS_PATH must be set"
  exit 1
elif [[ ! -d "$RESULTS_PATH" ]]; then
  echo "::error::'$RESULTS_PATH' does not exist or is not a directory"
  exit 1
fi

SCRIPT_PATH=$(
  cd "$(dirname "${BASH_SOURCE[0]}")" || return
  pwd -P
)
TARGET_DIR=$REPORT_ID
REPORTS_BASE_URL=http://a8c-jetpack-e2e-reports.s3-website-us-east-1.amazonaws.com/reports
TARGET_RESULTS_PATH="$TARGET_DIR/results"
TARGET_REPORT_PATH="$TARGET_DIR/report"
s3_reports_path="s3://a8c-jetpack-e2e-reports/reports"

# Copy new results into final results path
echo "Creating target results dir '$TARGET_RESULTS_PATH'"
mkdir -p "$TARGET_RESULTS_PATH"

for d in "$RESULTS_PATH"/*; do
  echo "Copy results from $d to $TARGET_RESULTS_PATH"
  cp -R "$d/allure-results/." "$TARGET_RESULTS_PATH" || true
done

echo "Getting history from existing report"
aws s3 cp --only-show-errors --recursive "$s3_reports_path/$REPORT_ID/report/history" "$TARGET_RESULTS_PATH/history" || true

echo "Creating executor.json"

jq -n --arg url "$REPORTS_BASE_URL" \
  --arg reportUrl "$REPORTS_BASE_URL/$REPORT_ID/report" \
  --arg buildName "run #$RUN_ID" \
  '{"type":"github", "buildName":$buildName, "url":$url,"reportUrl":$reportUrl}' \
  >"$TARGET_RESULTS_PATH/executor.json"
cat "$TARGET_RESULTS_PATH/executor.json"

echo "Overwriting categories.json"
cp "$SCRIPT_PATH/categories.json" "$TARGET_RESULTS_PATH/categories.json"

echo "Generating new report"
allure generate --clean "$TARGET_RESULTS_PATH" --output "$TARGET_REPORT_PATH"

echo "Setting report title"
# shellcheck disable=SC2002
cat "$TARGET_REPORT_PATH/widgets/summary.json" | jq --arg name "Test report $REPORT_ID" '.reportName|=$name' >"$TARGET_REPORT_PATH/widgets/summary.tmp"
mv "$TARGET_REPORT_PATH/widgets/summary.tmp" "$TARGET_REPORT_PATH/widgets/summary.json"
cat "$TARGET_REPORT_PATH/widgets/summary.json"

echo "Cleaning up: remove results dir $TARGET_RESULTS_PATH"
rm -rf "$TARGET_RESULTS_PATH"

echo "Writing metadata to file"
echo "$CLIENT_PAYLOAD" | jq --arg updateDate "$(date +"%Y-%m-%dT%H:%M:%S%z")" '. + {"updated_on":$updateDate}' >"$TARGET_DIR/metadata.json"
cat "$TARGET_DIR/metadata.json"

echo "Minifying JSON files"
while IFS= read -r -d '' file
do
  jq -c . < "$file" > "$file.min" && mv "$file.min" "$file"
done <   <(find "$TARGET_REPORT_PATH" -name '*.json' -print0)

echo "Copying report to S3"
#aws s3 cp "$TARGET_DIR" "$s3_reports_path/$REPORT_ID" --recursive --only-show-errors
rm -rf "$HOME/www"
cp -r "$TARGET_DIR/report" "$HOME/www"

