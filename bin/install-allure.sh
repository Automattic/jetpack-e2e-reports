#!/bin/bash

set -eo pipefail

java -version

echo "Installing Allure"
ALLURE_VERSION=2.14.0
ALLURE_DOWNLOAD_URL=https://github.com/allure-framework/allure2/releases/download/$ALLURE_VERSION/allure-$ALLURE_VERSION.zip
wget --no-verbose -O allure.zip $ALLURE_DOWNLOAD_URL \
  && unzip allure.zip -d . \
  && rm -rf allure.zip \

ALLURE_PATH=$PWD/allure-$ALLURE_VERSION/bin
export PATH="$ALLURE_PATH:$PATH"
allure --version

echo "$ALLURE_PATH" >> "$GITHUB_PATH"
