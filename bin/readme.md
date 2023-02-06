# Scripts

The reports and other statistics are generated using a set of scripts, triggered by a repository_dispatch event sent by the Jetpack monorepo after a test run is completed.

The information required to successfully create a report and other statistics following a test run:
- build artifacts in the GitHub job that triggered the report (allure results)
  - `allure-results` folder, contains the test results in json format and other attachments
  - `report_metadata.json` file, contains information about the test run and is stored in the triggering job build artifacts
- client payload

```json
{
  "branch": "test/test-branch",
  "pr_number": "99999",
  "pr_title": "pull request title",
  "report_name": "99999",
  "repository": "Automattic/jetpack",
  "run_id": "2259156708"
}
```

## Used scripts

- [generate-report-s3.sh](generate-report-s3.sh) - generates a report for a given test run. Triggered by a repository_dispatch event, for each test run in the monorepo.
- [generate-perf-report.js](generate-perf-report.js) - generates a performance tests report. Triggered by a repository_dispatch event, for each blocks performance test run in the monorepo.
- [update-reports-list.js](update-reports-list.js) - updates the reports data file. Triggered after a report is created.
- [update-errors-list.js](update-errors-list.js) - updates the errors data file. Triggered after a report is created.
- [update-tests-list.js](update-tests-list.js) - updates the tests data files. Triggered after a report is created.
- [recreate-time-stats.js](recreate-time-stats.js) - updates the stats data files. Triggered on a schedule, multiple times per day.
- [cleanup-s3.js](cleanup-s3.js) - deletes old reports and test results from S3. Triggered by a schedule event.
