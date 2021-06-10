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
  git pull
  git add .
  git commit -m "$MESSAGE"
  git push
fi
