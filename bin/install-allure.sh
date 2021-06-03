#!/bin/bash

set -eo pipefail

sudo apt-add-repository ppa:qameta/allure
sudo apt-get update

echo "Installing Allure"
sudo apt-get install allure
