#!/usr/bin/env bash

# Required:
# - RESULTS_PATH: Path to the test output directory
# - PR_NUMBER: The number of the Jetpack PR that triggered this workflow
# - BRANCH: The name of the Jetpack branch (excluded by PR_NUMBER)
# - SITE_ROOT: The path to the folder that will be served as static site (path to reports folders)

set -eo pipefail

# Test Allure installation
allure --version

BASE_URL="https://automattic.github.io/jetpack-e2e-reports"

if [[ -z "$RESULTS_PATH" ]]; then
  echo "::error::RESULTS_PATH must be set"
  exit 1
elif [[ ! -d "$RESULTS_PATH" ]]; then
  echo "::error::'$RESULTS_PATH' does not exist or is not a directory"
  exit 1
fi

if [[ -z "$SITE_ROOT" ]]; then
  echo "::error::SITE_ROOT path must be set"
  exit 1
fi

if [[ -z "$REPORT_NAME" ]]; then
  echo "REPORT_NAME is not defined, using PR_NUMBER or BRANCH"

  if [[ -z "$PR_NUMBER" ]]; then
    echo "PR_NUMBER is not defined, using BRANCH"

    if [[ -z "$BRANCH" ]]; then
      echo "::error::PR_NUMBER or BRANCH is not defined"
      exit 1
    else
      TARGET_DIR="$SITE_ROOT/$BRANCH"
      REPORT_URL="$BASE_URL/$BRANCH/report"
      REPORT_TITLE="Test report for $BRANCH branch"
    fi
  else
    TARGET_DIR="$SITE_ROOT/$PR_NUMBER"
    REPORT_URL="$BASE_URL/$PR_NUMBER/report"
    REPORT_TITLE="Test report for PR $PR_NUMBER"
  fi
else
  TARGET_DIR="$SITE_ROOT/$REPORT_NAME"
  REPORT_URL="$BASE_URL/$REPORT_NAME/report"
  REPORT_TITLE="Test report for $REPORT_NAME"
fi

TARGET_RESULTS_PATH="$TARGET_DIR/results"
TARGET_REPORT_PATH="$TARGET_DIR/report"
HISTORY_PATH="$TARGET_REPORT_PATH/history"
HISTORY_TC_PATH="$TARGET_REPORT_PATH/data/test-cases"
HISTORY_ATTACHMENT_PATH="$TARGET_REPORT_PATH/data/attachments"

# Copy new results into final results path
echo "Creating target results dir '$TARGET_RESULTS_PATH'"
mkdir -p "$TARGET_RESULTS_PATH"

for d in "$RESULTS_PATH"/*; do
  echo "Copy results from $d to $TARGET_RESULTS_PATH"
  cp -R "$d/allure-results/." "$TARGET_RESULTS_PATH"
done

if [ -d "$HISTORY_PATH" ]; then
  echo "Copying history from existing report: $HISTORY_PATH -> $TARGET_RESULTS_PATH"
  cp -R "$HISTORY_PATH" "$TARGET_RESULTS_PATH"
fi

if [ -d "$HISTORY_TC_PATH" ]; then
  echo "Copying test cases from existing report: $HISTORY_TC_PATH -> $TARGET_RESULTS_PATH"
  cp -R "$HISTORY_TC_PATH" "$TARGET_RESULTS_PATH"
fi

if [ -d "$HISTORY_ATTACHMENT_PATH" ]; then
  echo "Copying attachments from existing report: $HISTORY_ATTACHMENT_PATH -> $TARGET_RESULTS_PATH"
  cp -R "$HISTORY_ATTACHMENT_PATH" "$TARGET_RESULTS_PATH"
fi

echo "Creating executor.json"
jq -n --arg url "$BASE_URL" \
  --arg reportUrl "$REPORT_URL" \
  '{"url":$url,"reportUrl":$reportUrl}' \
  >"$TARGET_RESULTS_PATH/executor.json"
cat "$TARGET_RESULTS_PATH/executor.json"

echo "Generating new report for $TARGET_DIR"
allure generate --clean "$TARGET_RESULTS_PATH" --output "$TARGET_REPORT_PATH"

echo "Copying historic test cases into report"
cp -R "$TARGET_RESULTS_PATH/test-cases/." "$HISTORY_TC_PATH" 2>/dev/null || :
echo "Copying historic attachments into report"
cp -R "$TARGET_RESULTS_PATH/attachments/." "$HISTORY_ATTACHMENT_PATH" 2>/dev/null || :

echo "Setting report title to $REPORT_TITLE"
# shellcheck disable=SC2002
cat "$TARGET_REPORT_PATH/widgets/summary.json" | jq --arg name "$REPORT_TITLE" '.reportName|=$name' >"$TARGET_REPORT_PATH/widgets/summary.tmp"
mv "$TARGET_REPORT_PATH/widgets/summary.tmp" "$TARGET_REPORT_PATH/widgets/summary.json"
cat "$TARGET_REPORT_PATH/widgets/summary.json"

echo "Cleaning up: remove results dir $TARGET_RESULTS_PATH"
rm -rf "$TARGET_RESULTS_PATH"

echo "Writing metadata to file"
#echo "$CLIENT_PAYLOAD" >"$TARGET_DIR/metadata.json"
echo "$CLIENT_PAYLOAD" | jq --arg updateDate "$(date +"%Y-%m-%dT%H:%M:%S%z")" '. + {"updated_on":$updateDate}'  >"$TARGET_DIR/metadata.json"
cat "$TARGET_DIR/metadata.json"
