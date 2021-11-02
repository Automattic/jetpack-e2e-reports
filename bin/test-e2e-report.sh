BASE_PATH=$(
  cd "$(dirname "${BASH_SOURCE[0]}")" || return
  pwd -P
)

export RESULTS_PATH="$BASE_PATH"/../downloads
export SITE_ROOT="$HOME/www"
export PR_NUMBER=1111
export RUN_ID=99999

bash "$BASE_PATH"/generate-report.sh
