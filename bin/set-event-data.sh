#!/usr/bin/env bash

set -euo pipefail

echo "GITHUB_EVENT_NAME: $GITHUB_EVENT_NAME"
echo "$CLIENT_PAYLOAD"

# Determine REPORT_ID with proper quoting to prevent injection
if [[ -z "${REPORT_NAME:-}" ]]; then
  echo "REPORT_NAME is not defined, checking PR_NUMBER or BRANCH"

  if [[ -z "${PR_NUMBER:-}" ]]; then
    echo "PR_NUMBER is not defined, checking BRANCH"

    if [[ -z "${BRANCH:-}" ]]; then
      echo "::error::PR_NUMBER or BRANCH is not defined"
      exit 1
    else
      echo "Setting REPORT_ID to BRANCH"
      # Use printf to safely output the value without shell expansion
      printf "REPORT_ID=%s\n" "$BRANCH" >> "$GITHUB_ENV"
    fi
  else
    echo "Setting REPORT_ID to PR_NUMBER"
    printf "REPORT_ID=%s\n" "$PR_NUMBER" >> "$GITHUB_ENV"
  fi
else
  echo "Setting REPORT_ID to REPORT_NAME"
  printf "REPORT_ID=%s\n" "$REPORT_NAME" >> "$GITHUB_ENV"
fi
