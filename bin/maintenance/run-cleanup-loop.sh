#!/bin/bash

for i in {1..50}
do
    echo "Running cleanup iteration $i/50"
    node ./bin/cleanup-s3.js --storageOnly --skipGithubStatus --batchSize 50
    echo "Completed iteration $i"
    echo "---"
done

echo "All iterations completed!