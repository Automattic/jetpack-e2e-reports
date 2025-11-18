#!/usr/bin/env bash

# This script generates a report from the Allure results in the RESULTS_PATH directory and uploads it to S3.
# Required:
# - RESULTS_PATH: Path to the test output directory
# - REPORTS_PATH: The local path where the reports will be generated. Multiple reports can be generated in this directory, e.g. 'reports/atomic', 'reports/jetpack-production'

set -euo pipefail

# Test Allure installation
allure --version

# Check that Allure results directory exists
if [[ -z "${RESULTS_PATH:-}" ]]; then
  echo "::error::RESULTS_PATH must be set"
  exit 1
elif [[ ! -d "$RESULTS_PATH" ]]; then
  echo "::error::'RESULTS_PATH' does not exist or is not a directory"
  exit 1
fi

if [[ -z "${LOCAL_REPORTS_PATH:-}" ]]; then
  echo "::error::'LOCAL_REPORTS_PATH' is not defined"
  exit 1
fi

SCRIPT_PATH=$(
  cd "$(dirname "${BASH_SOURCE[0]}")" || return
  pwd -P
)

# Resolve RESULTS_PATH to absolute path and validate it's within workspace
RESULTS_PATH_ABS=$(cd "$RESULTS_PATH" && pwd -P)
WORKSPACE_PATH=$(pwd -P)
s3_reports_path="s3://a8c-jetpack-e2e-reports/reports"
REPORTS_BASE_URL=$(node "$SCRIPT_PATH/get-config-value.js" reportDeepUrl)

# Ensure RESULTS_PATH doesn't escape the workspace (GitHub Actions workspace)
if [[ "$RESULTS_PATH_ABS" != "$WORKSPACE_PATH"* ]] && [[ "$RESULTS_PATH_ABS" != "$(dirname "$WORKSPACE_PATH")"* ]]; then
  echo "::error::RESULTS_PATH resolves outside workspace: $RESULTS_PATH_ABS"
  exit 1
fi

echo
echo "----------------------------------------"

for d in "$RESULTS_PATH"/*; do
  echo "Checking for report metadata in $d"

  # Ensure report-metadata.json exists
  if [[ ! -f "$d/report-metadata.json" ]]; then
    echo "::warning::No report-metadata.json found in $d, skipping"
    continue
  fi

  REPORT_ID=$(jq -r '.suite // ""' "$d/report-metadata.json")

  # Validate REPORT_ID
  if [[ -z "$REPORT_ID" ]]; then
    echo "::error::Empty report ID from $d/report-metadata.json"
    exit 1
  fi

  if [[ ! "$REPORT_ID" =~ ^[A-Za-z0-9_-]+$ ]]; then
    echo "::error::Invalid report ID: '$REPORT_ID'"
    exit 1
  fi

  echo "Found report id: $REPORT_ID"
  RESULTS_DIR="$LOCAL_REPORTS_PATH/$REPORT_ID/results"
  echo "Creating '$RESULTS_DIR' results dir if it doesn't already exist"
  mkdir -p "$RESULTS_DIR"
  echo "Copy results from '$d/allure-results' to '$RESULTS_DIR'"
  cp -R "$d/allure-results/." "$RESULTS_DIR" || true
  echo

  # Check for results.xml and upload to S3 with timestamp
  echo "Checking for results.xml in $d"
  if [[ -f "$d/results.xml" ]]; then
    echo "Found results.xml, uploading to S3 with timestamp"
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    RESULTS_XML_NAME="results_${TIMESTAMP}.xml"
    DESTINATION_PATH="$s3_reports_path/junit/queue/$RESULTS_XML_NAME"
    echo "Uploading $d/results.xml to $DESTINATION_PATH"
    aws s3 cp "$d/results.xml" "$DESTINATION_PATH"
    echo "Upload complete: $RESULTS_XML_NAME"
  else
    echo "No results.xml found in $d"
  fi

  # Check for CTRF reports and upload to S3 with timestamp
  echo "Checking for CTRF reports in $d"
  CTRF_FILES=$(find "$d" -maxdepth 1 -name "ctrf-report-*.json" -print)
  if [[ -n "$CTRF_FILES" ]]; then
    echo "Found CTRF reports, uploading to S3"
    while IFS= read -r ctrf_file; do
      if [[ -f "$ctrf_file" ]]; then
        CTRF_FILENAME=$(basename "$ctrf_file")
        DESTINATION_PATH="$s3_reports_path/ctrf/$CTRF_FILENAME"
        echo "Uploading $ctrf_file to $DESTINATION_PATH"
        aws s3 cp "$ctrf_file" "$DESTINATION_PATH"
        echo "Upload complete: $CTRF_FILENAME"
      fi
    done <<< "$CTRF_FILES"
  else
    echo "No CTRF reports found in $d"
  fi
done

echo "----------------------------------------"

for d in "$LOCAL_REPORTS_PATH"/*; do
  REPORT_ID=$(basename "$d")

  # Validate REPORT_ID to prevent path traversal
  if [[ ! "$REPORT_ID" =~ ^[A-Za-z0-9_-]+$ ]]; then
    echo "::error::Invalid report ID from path: '$REPORT_ID'"
    exit 1
  fi

  echo "Creating report '$REPORT_ID'"
  RESULTS_PATH="$d/results"
  REPORT_PATH="$d/report"

  echo "Getting history from existing report in S3"
  aws s3 cp --only-show-errors --recursive "$s3_reports_path/$REPORT_ID/report/history" "$RESULTS_PATH/history" || true

  echo "Creating executor.json"
  jq -n --arg url "$REPORTS_BASE_URL" \
    --arg reportUrl "$REPORTS_BASE_URL/$REPORT_ID/report" \
    --arg buildName "run #$RUN_ID" \
    '{"type":"github", "buildName":$buildName, "url":$url,"reportUrl":$reportUrl}' \
    >"$RESULTS_PATH/executor.json"
  cat "$RESULTS_PATH/executor.json"

  echo "Overwriting categories.json"
  cp "$SCRIPT_PATH/categories.json" "$RESULTS_PATH/categories.json"

  echo "Generating new report"
  allure generate --clean "$RESULTS_PATH" --output "$REPORT_PATH"

  echo "Updating report title"
  # shellcheck disable=SC2002
  cat "$REPORT_PATH/widgets/summary.json" | jq --arg name "Test results for '$REPORT_ID'" '.reportName|=$name' >"$REPORT_PATH/widgets/summary.tmp"
  mv "$REPORT_PATH/widgets/summary.tmp" "$REPORT_PATH/widgets/summary.json"
  cat "$REPORT_PATH/widgets/summary.json"

  echo "Cleaning up: remove results dir $RESULTS_PATH"
  rm -rf "$RESULTS_PATH"

  echo "Writing metadata to file"

  # Validate CLIENT_PAYLOAD is valid JSON if not empty
  if [[ -n "${CLIENT_PAYLOAD:-}" ]]; then
    if ! echo "$CLIENT_PAYLOAD" | jq empty 2>/dev/null; then
      echo "::error::CLIENT_PAYLOAD is not valid JSON"
      exit 1
    fi
  else
    CLIENT_PAYLOAD='{}'
  fi

  echo "$CLIENT_PAYLOAD" | jq --arg updateDate "$(date +"%Y-%m-%dT%H:%M:%S%z")" '. + {"updated_on":$updateDate}' >"$d/metadata.json"
  cat "$d/metadata.json"

  echo "Minifying JSON files"
  while IFS= read -r -d '' file
  do
    jq -c . < "$file" > "$file.min" && mv "$file.min" "$file"
  done <   <(find "$REPORT_PATH" -name '*.json' -print0)

  echo "Copying report to S3"
  aws s3 cp "$d" "$s3_reports_path/$REPORT_ID" --recursive --only-show-errors

  echo
done

echo "----------------------------------------"

