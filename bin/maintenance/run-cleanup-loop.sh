#!/bin/bash

for i in {1..500}
do
    echo "Running cleanup iteration $i/500"
    node ./bin/cleanup-s3.js --skipGitHubStatus
    echo "Completed iteration $i"
    echo "---"
done

echo "All iterations completed!