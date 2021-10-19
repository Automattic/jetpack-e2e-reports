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

echo "Cleaning up reports for closed PRs or older than $DAYS days"
echo

script_path=$(
  cd "$(dirname "${BASH_SOURCE[0]}")" || return
  pwd -P
)

mapfile -t permanentReports < <(jq -r '.permanent[]' "$script_path/../src/config.json")
echo "Permanent reports: ${permanentReports[*]}"

# Read the ignore list from config and append "docs" to each folder in list to have a complete path
mapfile -t ignoreList < <(jq -r '.ignore[]' "$script_path/../src/config.json")
ignoreList=( "${ignoreList[@]/#/docs/}" )
echo "Ignore list: ${ignoreList[*]}"
echo

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

is_old() {
  cleanup_date=$(date --date="-${DAYS} day" +%Y-%m-%d)
  last_update=$(date --date="$(jq -r '.updated_on' "$1/metadata.json")" +%Y-%m-%d)

  echo "Last updated in $last_update"
  [[ $cleanup_date > $last_update ]]
}

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

  if is_closed "$path"; then
    # Remove the entire folder because PR is closed
    echo "Removing $path, pull request closed"
    rm -rf "$path"
  elif is_old "$path"; then
    # Remove the entire folder because it was unchanged since $DAYS days ago
    echo "Removing $path, hasn't been updated in the last $DAYS days"
    rm -rf "$path"
  fi

  echo
done
