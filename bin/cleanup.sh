#!/usr/bin/env bash

# The scope of this script is to remove results older than a specified number of days.

# Required:
# - DAYS: the number of days to keep reports for

# Steps:
# * Go through each sub-folder of `docs` folder and check the git log
# * If the folder was not updated in the last `DAYS` days delete the folder
# * If the folder is for a PR that was closed delete the folder
# * If the folder was updated and PR was not closed then check the existing report and remove results not included in history

# shellcheck disable=SC2012

set -eo pipefail

if [[ -z "$DAYS" ]]; then
  echo "::error::DAYS must be set"
  exit 1
fi

is_merged() {
  pr=$(basename "$1")
  # shellcheck disable=SC2034
  state=$(curl -s https://api.github.com/repos/automattic/jetpack/pulls/$pr | jq -r '.state')

  echo "PR $pr state: $state"

  [ "$state" == "closed" ]
}

echo "Cleaning up reports for closed PRs or older than $DAYS days"
echo

clean_tests() {
  historyFile="$1/report/history/history.json"
  testCasesPath="$1/report/data/test-cases"
  
  if [ ! -f "$historyFile" ]; then
    echo "$historyFile cannot find history file. Skipping this dir."
    return
  fi

  testsToKeep=$(jq '[.[].items[].uid]' "$historyFile")
  #    echo "$testsToKeep"

  # Go through each test and check if it exists in history
  ls "$testCasesPath" | while read -r testCaseFile; do
    testCaseId=${testCaseFile%.*}
    #      echo "$testCaseFile"
    if [[ ! "${testsToKeep[@]}" =~ ${testCaseId} ]]; then
      # Test doesn't exist in history, it can be removed
      echo -e "\tCleaning attachments for test $testCaseId"
      clean_attachments "$1" "$testCasesPath/$testCaseFile"
      echo -e "\tRemoving test file $testCaseFile"
      rm "$testCaseFile"
    fi
  done
}

clean_attachments() {
  attachmentsPath="$1/report/data/attachments"
  testCaseFile="$2"

  if [ ! -d "$attachmentsPath" ]; then
    return
  fi

  attachmentsToRemove=$(jq '.. | ."attachments"? | select(. != null)  | select(. != []) | .[].source' "$testCaseFile")
  #  echo "$attachmentsToRemove"

  ls "$attachmentsPath" | while read -r attachmentFile; do
    #      echo "$attachmentFile"
    if [[ "${attachmentsToRemove[@]}" =~ ${attachmentFile} ]]; then
      echo -e "\t\tRemoving attachment $attachmentFile"
      rm "$attachmentsPath/$attachmentFile"
    fi
  done
}

# Go through each sub-folder of `docs` folder
ls -d docs/*/ | while read -r path; do
  # Remove the last backslash in path
  # shellcheck disable=SC2001
  path=$(echo "$path" | sed 's:/*$::')

  if [ "$path" == "docs/static" ]; then
    # `static` is not a results folder, ignore it
    echo "Ignoring $path, not in clean-up scope"
    continue
  fi

  last_update="$(git log -1 --format="%aD" -- "$path")"
  old_log_entries=$(git log --since "$DAYS days ago" -- "$path")

  if is_merged "$path"; then
    # Remove the entire folder because PR is closed
    echo "Removing $path, pull request closed"
    rm -rf "$path"
  elif [ "$old_log_entries" == "" ]; then
    # Remove the entire folder because it was unchanged since $DAYS days ago
    echo "Removing $path, last updated in $last_update"
    rm -rf "$path"
  else
    # Folder was recently updated, we should check its content and remove old results
    echo "Checking $path, last updated in $last_update"
    initial_file_count=$(find "$path" -type f | wc -l)

    clean_tests "$path"

    final_count=$(find "$path" -type f | wc -l)
    diff=$((initial_file_count - final_count))

    echo -e "\t$diff files removed from $path"
  fi
  echo
done
