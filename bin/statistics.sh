echo "::group::{Collect reports data}"
node ./bin/create-summary.js
echo "::endgroup::"

echo "::group::{Collect daily and weekly data}"
node ./bin/create-time-stats.js
echo "::endgroup::"

echo "::group::{Collect failures data}"
node ./bin/create-failures-list.js
echo "::endgroup::"

echo "::group::{Collect tests data}"
node ./bin/create-tests-list.js
echo "::endgroup::"

cp -a ./docs/data/. ./public/data
aws s3 cp ./docs/data "s3://a8c-jetpack-e2e-reports/data" --recursive --only-show-errors
echo "Done!"
