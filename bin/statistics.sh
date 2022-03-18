echo "==> Collect reports data"
node ./bin/create-summary.js
echo
echo "==> Collect daily and weekly data"
node ./bin/create-time-stats.js
echo
echo "==> Collect failures data"
node ./bin/create-failures-list.js
echo
echo "==> Collect tests data"
node ./bin/create-tests-list.js
echo
cp -a ./docs/data/. ./public/data
echo "Done!"
