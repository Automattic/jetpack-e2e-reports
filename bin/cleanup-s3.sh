#!/usr/bin/env bash

# The scope of this script is to remove results older than a specified number of days.

# Required:
# - DAYS: the number of days to keep reports for

# Steps:
# * Go through each sub-folder of `reports` folder and check the metadata.json file for last updated date.
# * If the folder was not updated in the last `DAYS` days delete the folder
# * If the folder is for a PR that was closed delete the folder
# * If the folder was updated and PR was not closed, or the report is not for a PR, check the existing report and remove results not included in history

# shellcheck disable=SC2012

set -eo pipefail

if [[ -z "$DAYS" ]]; then
  echo "::error::DAYS must be set"
  exit 1
fi

echo "Cleaning up reports for closed PRs or older than $DAYS days"
echo

s3_reports_path="s3://jetpack-e2e-reports/reports"
working_dir="$(mktemp -d)"

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
  cleanup_date=$(gdate --date="-${DAYS} day" +%Y-%m-%d)
  last_update=$(gdate --date="$(aws s3 cp --quiet "$s3_reports_path/$1/metadata.json" /dev/stdout | jq -r '.updated_on')" +%Y-%m-%d)

  echo "Last updated in $last_update"
  [[ $cleanup_date > $last_update ]]
}

clean_tests() {
  historyFile="$working_dir/$1/history.json"

  # Download a local copy of history file
  aws s3 cp --only-show-errors "$s3_reports_path/$1/report/history/history.json" "$historyFile" || true

  testCasesPath="$s3_reports_path/$1/report/data/test-cases"

  if [ ! -f "$historyFile" ]; then
    echo -e "\t::error::Cannot find expected history file $historyFile. Skipping cleaning this dir."
    return
  fi

  if [ ! "$(aws s3 ls "$testCasesPath")" ]; then
    echo -e "\t::error::Cannot find expected test cases dir $testCasesPath. Skipping cleaning this dir."
    return
  fi

  testsToKeep=$(jq '[.[].items[].uid]' "$historyFile")

  # Go through each test and check if it exists in history
  aws s3 ls "$testCasesPath/" | awk '{print $4}' | while read -r testCaseFile; do
    testCaseId=${testCaseFile%.*}
    if [[ ! "${testsToKeep[*]}" =~ ${testCaseId} ]]; then
      # Test doesn't exist in history, it can be removed
      echo -e "\tFound old test $testCaseId"
      clean_attachments "$1" "$testCaseFile"
      echo -e "\t\tRemoving test file $testCasesPath/$testCaseFile"
      aws s3 rm --only-show-errors "$testCasesPath/$testCaseFile"
    fi
  done
}

clean_attachments() {
#  echo -e "\t\tCleaning attachments for test $2"
  attachmentsPath="$s3_reports_path/$1/report/data/attachments"

  if [ ! "$(aws s3 ls "$attachmentsPath")" ]; then
    # not really an error, folder is missing if there are no attachments
    return
  fi

  localTestCaseFile="$working_dir/$1/report/data/test-cases/$2"

  # Download a local copy of the test case file
  aws s3 cp --only-show-errors "$s3_reports_path/$1/report/data/test-cases/$2" "$localTestCaseFile" || true

  if [ ! -f "$localTestCaseFile" ]; then
      echo -e "\t\t::error::Cannot find expected test case file $localTestCaseFile, so I cannot find what attachments to delete!"
      return
  fi

  attachmentsToRemove=$(jq '.. | ."attachments"? | select(. != null)  | select(. != []) | .[].source' "$localTestCaseFile")
#    echo "$attachmentsToRemove"

  aws s3 ls "$attachmentsPath/" | awk '{print $4}' | while read -r attachmentFile; do
#          echo "$attachmentFile"
    if [[ "${attachmentsToRemove[*]}" =~ ${attachmentFile} ]]; then
      echo -e "\t\tRemoving attachment $attachmentsPath/$attachmentFile"
      aws s3 rm --only-show-errors "$attachmentsPath/$attachmentFile"
    fi
  done
}

# Go through each sub-folder of `docs` folder
aws s3 ls $s3_reports_path/ | awk '{print $2}' | awk -F '/' '/\// {print $1}' | while read -r dir_name; do
  echo "$dir_name"

  if [[ "${ignoreList[*]}" =~ ${dir_name} ]]; then
    echo "Ignoring $dir_name, not in clean-up scope"
    echo
    continue
  fi

  if is_closed "$dir_name"; then
    # Remove the entire folder because PR is closed
    echo "Removing $dir_name, pull request closed"
    aws s3 rm "$s3_reports_path/$dir_name/" --only-show-errors --recursive
  elif is_old "$dir_name"; then
    # Remove the entire folder because it was unchanged since $DAYS days ago
    echo "Removing $dir_name, hasn't been updated in the last $DAYS days"
    aws s3 rm "$s3_reports_path/$dir_name/" --only-show-errors --recursive
  else
    # Folder was recently updated, we should check its content and remove old results
    echo "Checking $dir_name for old files"
    clean_tests "$dir_name"
  fi

  echo
done

echo "Removing temp working dir $working_dir"
rm -rf "$working_dir"
