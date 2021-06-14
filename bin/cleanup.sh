#!/usr/bin/env bash

# The scope of this script is to remove results older than a specified number of days.

# Required:
# - DAYS: the number of days to keep results for

# Steps:
# * Go through each sub-folder of `docs` folder and check the git log
# * If the folder was not updated in the last `DAYS` days delete the folder
# * If the folder was updated then check the contents of `allure-results` sub-folder
# * If any results files in `allure-results` sub-folder are older than `DAYS` days remove them
# * If results files are removed then regenerate the report for the folder

# shellcheck disable=SC2012

set -eo pipefail

if [[ -z "$DAYS" ]]; then
	echo "::error::DAYS must be set"
	exit 1
fi

echo "Cleaning results since $DAYS days ago"
echo

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
  if [ "$old_log_entries" == "" ]; then
    # Remove the entire folder because it was unchanged since $DAYS days ago
    echo "Removing $path, last updated in $last_update"
     rm -rf "$path"
  else
    # Folder was recently updated, we should check its content for older files
    echo "Checking $path, last updated in $last_update"

    results_dir="$path/allure-results"
    initial_file_count=$(ls "$results_dir" | wc -l)

    echo -e "\t$((initial_file_count)) files in $results_dir"

    git ls-tree -r --name-only HEAD | grep "$results_dir" | while read -r file; do
      last_update="$(git log -1 --format="%aD" -- "$file")"

      if [ "$(git log --since "$DAYS days ago" -- "$file")" == "" ]; then
        # Remove the file because it was unchanged since $DAYS days ago
        echo -e "\tRemoving $file, last updated in $last_update"
        rm -rf "$file"
      else
        echo -e "\tSkipping $file, last updated in $last_update"
      fi
    done

    final_count=$(ls "$results_dir" | wc -l)
    diff=$((initial_file_count - final_count))

    echo -e "\t$diff files removed from $path"

    root_path=$(pwd)
    if [ "$diff" -gt 0 ]; then
      echo -e "\tRecreating report $path"
      cd "$path"
      echo -e "\t$(allure generate --clean --output report)"
      cd "$root_path"
    fi

  fi
done
