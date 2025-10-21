#!/bin/bash

set -euo pipefail

# Validate inputs
if [[ -z "${RUN_ID:-}" ]]; then
	echo "::error::RUN_ID must be set"
	exit 1
fi

if [[ -z "${REPOSITORY:-}" ]]; then
	echo "::error::REPOSITORY must be set in the form 'organisation/repository'"
	exit 1
fi

# Validate RUN_ID is numeric
if [[ ! "$RUN_ID" =~ ^[0-9]+$ ]]; then
	echo "::error::RUN_ID must be numeric"
	exit 1
fi

# Validate REPOSITORY format
if [[ ! "$REPOSITORY" =~ ^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$ ]]; then
	echo "::error::REPOSITORY must be in format 'owner/repo'"
	exit 1
fi

get_artifacts_count() {
  curl -s "https://api.github.com/repos/${REPOSITORY}/actions/runs/${RUN_ID}/artifacts" | jq '.total_count'
}

ARTEFACTS_COUNT=$( get_artifacts_count )

i=1
while [ $i -le 24 ] && [ "$ARTEFACTS_COUNT" == 0 ]
do
  echo "Found artifacts: $ARTEFACTS_COUNT"
  echo "Waiting for artifacts to be available ($i)"
  sleep 10
  i=$(( $i + 1 ))
  ARTEFACTS_COUNT=$( get_artifacts_count )
done
