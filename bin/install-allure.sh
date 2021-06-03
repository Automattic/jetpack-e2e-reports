#!/bin/bash

set -eo pipefail

java -version

echo "Installing Allure"
ALLURE_VERSION=2.14.0
ALLURE_DOWNLOAD_URL=https://github.com/allure-framework/allure2/releases/download/$ALLURE_VERSION/allure-$ALLURE_VERSION.zip
wget --no-verbose -O /tmp/allure.zip $ALLURE_DOWNLOAD_URL \
  && unzip /tmp/allure.zip -d .

allure --version
