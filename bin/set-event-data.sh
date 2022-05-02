#!/usr/bin/env bash

set -eo pipefail

echo "GITHUB_EVENT_NAME: $GITHUB_EVENT_NAME"

#if [ "$GITHUB_EVENT_NAME" == workflow_dispatch ]; then
#  {
#    echo "RUN_ID=${{ github.event.inputs.runId }}"
#    echo "PR_NUMBER=${{ github.event.inputs.pr }}"
#    echo "BRANCH=${{ github.event.inputs.branch }}"
#    echo "REPORT_NAME=${{ github.event.inputs.report_name }}"
#    echo "REPOSITORY=${{ github.event.inputs.repository }}"
#    echo "CLIENT_PAYLOAD={ \"branch\": \"${{ github.event.inputs.branch }}\", \"pr_number\": \"${{ github.event.inputs.pr }}\", \"pr_title\": \"${{ github.event.inputs.pr_title }}\", \"report_name\": \"${{ github.event.inputs.report_name }}\", \"repository\": \"${{ github.event.inputs.repository }}\", \"run_id\": \"${{ github.event.inputs.runId }}\", \"run_number\": \"000\" }"
#  } >> "$GITHUB_ENV"
#else
#    echo "Received event type: '${{ github.event.action }}'"
#fi

echo "$CLIENT_PAYLOAD"

if [[ -z "$REPORT_NAME" ]]; then
  echo "REPORT_NAME is not defined, checking PR_NUMBER or BRANCH"

  if [[ -z "$PR_NUMBER" ]]; then
    echo "PR_NUMBER is not defined, checking BRANCH"

    if [[ -z "$BRANCH" ]]; then
      echo "::error::PR_NUMBER or BRANCH is not defined"
      exit 1
    else
      echo "Setting REPORT_ID to $BRANCH"
      echo "REPORT_ID=$BRANCH" >> "$GITHUB_ENV"
    fi
  else
    echo "Setting REPORT_ID to $PR_NUMBER"
    echo "REPORT_ID=$PR_NUMBER" >> "$GITHUB_ENV"
  fi
else
  echo "REPORT_ID=$REPORT_NAME" >> "$GITHUB_ENV"
fi
