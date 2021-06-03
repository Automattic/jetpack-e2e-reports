#!/bin/bash

set -eo pipefail

apt-add-repository ppa:qameta/allure
apt-get update
apt-get install allure
