#!/usr/bin/env bash

# The scope of this script is to remove results older than a specified number of days.

# Required:
# - DAYS: the number of days to keep reports for

# Steps:
# * Go through each sub-folder of `docs` folder and check the git log
# * If the folder was not updated in the last `DAYS` days delete the folder
# * If the folder is for a PR that was closed delete the folder
# * If the folder was updated and PR was not closed or the report is not for a PR then check the existing report and remove results not included in history

# shellcheck disable=SC2012

set -eo pipefail

if [[ -z "$DAYS" ]]; then
  echo "::error::DAYS must be set"
  exit 1
fi

mapfile -t permanentReports < <(jq -r '.permanent[]' "src/config.json")
echo "Permanent reports: ${permanentReports[*]}"

# get the last 100 PRs: https://api.github.com/repos/automattic/jetpack/pulls

closedPrs=$(curl -s "https://api.github.com/repos/automattic/jetpack/pulls?state=closed&per_page=100" | jq '.[] | .number')
openedPrs=$(curl -s "https://api.github.com/repos/automattic/jetpack/pulls?state=open&per_page=100" | jq '.[] | .number')

is_closed() {
  pr=$(basename "$1")

  if [[ "${permanentReports[*]}" =~ ${pr} ]]; then
    state="not a PR"
  elif [[ "${openedPrs[*]}" =~ ${pr} ]]; then
    state="open"
  elif [[ "${closedPrs[*]}" =~ ${pr} ]]; then
      state="closed"
  else
    state=$(curl -s "https://api.github.com/repos/automattic/jetpack/pulls/$pr" | jq -r '.state')
  fi

  echo "PR $pr state: $state"

  [ "$state" == "closed" ]
}

echo "Cleaning up reports for closed PRs or older than $DAYS days"
echo

clean_tests() {
  historyFile="$1/report/history/history.json"
  testCasesPath="$1/report/data/test-cases"

  if [ ! -f "$historyFile" ]; then
    echo "Cannot find expected history file $historyFile. Skipping cleaning this dir."
    return
  fi

  if [ ! -d "$testCasesPath" ]; then
    echo "Cannot find expected test cases dir $testCasesPath. Skipping cleaning this dir."
    return
  fi

  testsToKeep=$(jq '[.[].items[].uid]' "$historyFile")

  # Go through each test and check if it exists in history
  ls "$testCasesPath" | while read -r testCaseFile; do
    testCaseId=${testCaseFile%.*}
    #      echo "$testCaseFile"
    if [[ ! "${testsToKeep[*]}" =~ ${testCaseId} ]]; then
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
    if [[ "${attachmentsToRemove[*]}" =~ ${attachmentFile} ]]; then
      echo -e "\t\tRemoving attachment $attachmentFile"
      rm "$attachmentsPath/$attachmentFile"
    fi
  done
}

# Read the ignore list from config and append "docs" to each folder in list to have a complete path
mapfile -t ignoreList < <(jq -r '.ignore[]' "config.json")
ignoreList=( "${ignoreList[@]/#/docs/}" )
echo "Ignore list: ${ignoreList[*]}"

# Go through each sub-folder of `docs` folder
ls -d docs/*/ | while read -r path; do
  # Remove the last backslash in path
  # shellcheck disable=SC2001
  path=$(echo "$path" | sed 's:/*$::')

  if [[ "${ignoreList[*]}" =~ ${path} ]]; then
    echo "Ignoring $path, not in clean-up scope"
    echo
    continue
  fi

  last_update="$(git log -1 --format="%aD" -- "$path")"
  old_log_entries=$(git log --since "$DAYS days ago" -- "$path")

  if is_closed "$path"; then
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
