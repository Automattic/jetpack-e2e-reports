#!/usr/bin/env bash

SCRIPT_PATH=$(
  cd "$(dirname "${BASH_SOURCE[0]}")" || return
  pwd -P
)

aws s3 sync s3://jetpack-e2e-reports/data "$SCRIPT_PATH/../data" --delete
