echo "::group::Collect reports data"
node ./bin/create-summary.js
echo "::endgroup::"

echo "::group::Collect daily and weekly data"
node ./bin/create-time-stats.js
echo "::endgroup::"

echo "::group::Collect failures data"
node ./bin/create-failures-list.js
echo "::endgroup::"

echo "::group::Collect tests data"
node ./bin/create-tests-list.js
echo "::endgroup::"

cp -a ./docs/data/. ./public/data
echo "Done!"
