#!/usr/bin/env bash

aws s3 sync s3://a8c-jetpack-e2e-reports/data /public/data --delete

bk_dir="./public/data-backup-$(date +"%Y%m%dT%H%M%S")"
cp -R ./public/data "$bk_dir"

sed -i 's/\"isMaster\"\:/\"isTrunk\"\:/g' ./public/data/errors.json
sed -i 's/\"master\"\:/\"trunk\"\:/g' ./public/data/summary.json
sed -i 's/\"master\"\:/\"trunk\"\:/g' ./public/data/results-daily.json
sed -i 's/\"master\"\:/\"trunk\"\:/g' ./public/data/results-weekly.json
sed -i 's/\"master\"\:/\"trunk\"\:/g' ./public/data/results-monthly.json

#aws s3 sync /public/data s3://a8c-jetpack-e2e-reports/data /public/data
