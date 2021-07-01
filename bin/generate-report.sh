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

if [[ -z "$PR_NUMBER" ]]; then
  echo "PR_NUMBER is not defined, using BRANCH"

  if [[ -z "$BRANCH" ]]; then
    echo "::error::PR_NUMBER or BRANCH is not defined"
    exit 1
  else
    TARGET_DIR="$SITE_ROOT/$BRANCH"
    REPORT_URL="$BASE_URL/$BRANCH"
  fi
else
  TARGET_DIR="$SITE_ROOT/$PR_NUMBER"
  REPORT_URL="$BASE_URL/$PR_NUMBER"
fi

TARGET_RESULTS_PATH="$TARGET_DIR/results"

# Copy new results into final results path
echo "Creating target results dir '$TARGET_RESULTS_PATH'"
mkdir -p "$TARGET_RESULTS_PATH"

for d in "$RESULTS_PATH"/*; do
  echo "Copy results from $d to $TARGET_RESULTS_PATH"
  cp -R "$d/allure-results/." "$TARGET_RESULTS_PATH"
done

HISTORY_PATH="$TARGET_RESULTS_PATH/report/history"
HISTORIC_TC_PATH="$TARGET_RESULTS_PATH/report/data/test-cases"
HISTORIC_ATTACHMENT_PATH="$TARGET_RESULTS_PATH/report/data/attachments"

if [ -d "$HISTORY_PATH" ]; then
  echo "Copying history from old report"
  cp -R "$HISTORY_PATH" "$TARGET_RESULTS_PATH"
fi

if [ -d "$HISTORIC_TC_PATH" ]; then
  echo "Copying historic test cases from old report"
  cp -R "$HISTORIC_TC_PATH" "$TARGET_RESULTS_PATH"
fi

if [ -d "$HISTORIC_ATTACHMENT_PATH" ]; then
  echo "Copying historic attachments from old report"
  cp -R "$HISTORIC_ATTACHMENT_PATH" "$TARGET_RESULTS_PATH"
fi

echo "Creating executor.json"
echo "{" >>"$TARGET_RESULTS_PATH/executor.json"
echo "\"url\":\"$BASE_URL\"," >>"$TARGET_RESULTS_PATH/executor.json"
echo "\"reportUrl\":\"$REPORT_URL\"" >>"$TARGET_RESULTS_PATH/executor.json"
echo "}" >>"$TARGET_RESULTS_PATH/executor.json"

echo "Generating new report for $TARGET_DIR"
cd "$TARGET_DIR"
allure generate --clean results --output report
cd ../..

echo "Copying historic test cases into report"
cp -R "$TARGET_RESULTS_PATH/test-cases/." "$HISTORIC_TC_PATH" 2>/dev/null || :
echo "Copying historic attachments into report"
cp -R "$TARGET_RESULTS_PATH/attachments/." "$HISTORIC_ATTACHMENT_PATH" 2>/dev/null || :

pwd
echo "Cleaning up: remove results dir $TARGET_RESULTS_PATH"
rm -rf "$TARGET_RESULTS_PATH"

# Write metadata to file
echo "$CLIENT_PAYLOAD" >"$TARGET_DIR/metadata.json"
