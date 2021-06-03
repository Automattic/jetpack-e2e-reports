#!/bin/bash

set -eo pipefail

# Test Java installation
java -version

ALLURE_VERSION=2.14.0
ALLURE_DOWNLOAD_URL=https://github.com/allure-framework/allure2/releases/download/$ALLURE_VERSION/allure-$ALLURE_VERSION.zip

echo "Installing Allure $ALLURE_VERSION"
wget --no-verbose -O allure.zip $ALLURE_DOWNLOAD_URL \
  && unzip allure.zip -d . \
  && rm -rf allure.zip \

# Add Allure in Github PATH to make it available to all subsequent actions in the current job
ALLURE_PATH=$PWD/allure-$ALLURE_VERSION/bin
echo "$ALLURE_PATH" >> "$GITHUB_PATH"

# Test Allure installation
allure --version
