 node ./bin/create-time-stats.js && cp ./docs/data/daily.json ./public/data/daily.json && cp ./docs/data/weekly.json ./public/data/weekly.json
 node ./bin/create-failures-list.js && cp ./docs/data/errors.json ./public/data/errors.json
 node ./bin/create-tests-list.js && cp ./docs/data/tests.json ./public/data/tests.json
