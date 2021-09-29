#!/usr/bin/env bash

set -eo pipefail

USERNAME="github-actions-bot"
EMAIL="$USERNAME@users.noreply.github.com"

if [[ -z "$MESSAGE" ]]; then
	echo "::warning::MESSAGE is not set. Using default commit message"
	MESSAGE="Automatic changes"
fi

# commit and push
if [ -z "$(git status --porcelain)" ]; then
  echo "There are no changes to deploy"
else
  git config --local user.name "$USERNAME"
  git config --local user.email "$EMAIL"
  git add .
  git commit -m "$MESSAGE $(date +"%Y-%m-%dT%H:%M:%S%z")"
  git fetch origin "$GITHUB_REF"
  git merge origin "$GITHUB_REF"
  git push origin "$GITHUB_REF"
fi
