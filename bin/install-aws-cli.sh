#!/bin/bash

set -eo pipefail

# Install aws-cli
#echo "Installing aws-cli"
#curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
#unzip awscliv2.zip
#./aws/install
# Test aws-cli installation
aws --version
