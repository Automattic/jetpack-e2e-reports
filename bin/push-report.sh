#!/usr/bin/env bash

set -eo pipefail

USERNAME="github-actions-bot"
EMAIL="$USERNAME@users.noreply.github.com"

# commit and push
if [ -z "$(git status --porcelain)" ]; then
  echo "There are no changes to deploy"
else
  git config --local user.name "$USERNAME"
  git config --local user.email "$EMAIL"
  git pull
  git add .
  git commit -m "Publish new test reports"
  git push
fi
