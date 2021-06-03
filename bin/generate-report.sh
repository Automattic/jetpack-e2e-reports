#!/usr/bin/env bash

# Required:
# - RESULTS_PATH: Path to the test output directory
# - PR_NUMBER: The number of the Jetpack PR that triggered this workflow
# - BRANCH: The name of the Jetpack branch (excluded by PR_NUMBER)

set -eo pipefail

# Test Allure installation
allure --version

if [[ -z "$RESULTS_PATH" ]]; then
	echo "::error::RESULTS_PATH must be set"
	exit 1
elif [[ ! -d "$RESULTS_PATH" ]]; then
	echo "::error::'$RESULTS_PATH' does not exist or is not a directory"
	exit 1
fi

if [[ -z "$PR_NUMBER" ]]; then
	echo "PR_NUMBER is not defined, using BRANCH"

	if [[ -z "$BRANCH" ]]; then
	  echo "::error::PR_NUMBER or BRANCH is not defined"
    exit 1
  else
    TARGET_RESULTS_PATH="reports/$BRANCH"
  fi
else
  TARGET_RESULTS_PATH="reports/$PR_NUMBER"
fi

# Copy new results into final results path
echo "Creating target results dir '$TARGET_RESULTS_PATH'"
mkdir -p "$TARGET_RESULTS_PATH"

for d in "$RESULTS_PATH"/*; do
    echo "Copy results from $d"
    cp -R "$(basename "$d")/allure-results" "$TARGET_RESULTS_PATH/"
done

echo "Generating new report for $TARGET_RESULTS_PATH"
cd "$TARGET_RESULTS_PATH"
allure generate --clean --output report

