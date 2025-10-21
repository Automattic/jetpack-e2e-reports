#!/usr/bin/env bash
# Validates and sanitizes inputs from repository_dispatch events

set -euo pipefail

# Validation patterns
VALID_RUN_ID_PATTERN='^[0-9]+$'
VALID_PR_NUMBER_PATTERN='^[0-9]*$'
VALID_REPOSITORY_PATTERN='^[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+$'
VALID_BRANCH_PATTERN='^[A-Za-z0-9/_.-]+$'
VALID_REPORT_NAME_PATTERN='^[A-Za-z0-9_-]*$'

validate_input() {
    local name="$1"
    local value="$2"
    local pattern="$3"

    if [[ ! "$value" =~ $pattern ]]; then
        echo "::error::Invalid $name: '$value' does not match allowed pattern"
        exit 1
    fi
}

# Validate RUN_ID
if [[ -n "${RUN_ID:-}" ]]; then
    validate_input "RUN_ID" "$RUN_ID" "$VALID_RUN_ID_PATTERN"
fi

# Validate PR_NUMBER
if [[ -n "${PR_NUMBER:-}" ]]; then
    validate_input "PR_NUMBER" "$PR_NUMBER" "$VALID_PR_NUMBER_PATTERN"
fi

# Validate REPOSITORY
if [[ -n "${REPOSITORY:-}" ]]; then
    validate_input "REPOSITORY" "$REPOSITORY" "$VALID_REPOSITORY_PATTERN"
fi

# Validate BRANCH
if [[ -n "${BRANCH:-}" ]]; then
    validate_input "BRANCH" "$BRANCH" "$VALID_BRANCH_PATTERN"
fi

# Validate REPORT_NAME
if [[ -n "${REPORT_NAME:-}" ]]; then
    validate_input "REPORT_NAME" "$REPORT_NAME" "$VALID_REPORT_NAME_PATTERN"
fi

echo "All inputs validated successfully"
