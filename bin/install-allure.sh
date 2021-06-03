#!/bin/bash

set -eo pipefail

echo "Installing Allure"
apt-add-repository ppa:qameta/allure
apt-get update
apt-get install allure
