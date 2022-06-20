[![Reports status](https://img.shields.io/website?down_color=grey&down_message=Dashboard%20offline&style=for-the-badge&label=E2E%20TEST%20REPORTS&up_color=green&up_message=see%20dashboard&url=https%3A%2F%2Fautomattic.github.io%2Fjetpack-e2e-reports%2F%23%2F)](https://automattic.github.io/jetpack-e2e-reports)

# Jetpack e2e test reports

This repo contains a dashboard with information for Jetpack e2e tests and code to create, store and maintain these e2e tests reports.

## Accessing reports

All reports are stored in an Amazon S3 bucket. Each PR gets its own report, the report ID being the number of the PR. A report is also created for all trunk merges.
You can find all the available reports by checking the [reports list](https://automattic.github.io/jetpack-e2e-reports/).

## How it works

The tests run in [Jetpack monorepo](https://github.com/Automattic/jetpack) CI. At the end of the E2E tests job suite a repository dispatch event is sent to this repo with all the required information about the test run, triggering the report workflow.

The reports are generated using [Allure](http://allure.qatools.ru) framework. Allure results in json format are being created by the tests and are stored as artefacts in GitHub after each test run. The workflow in this repo will download the artefacts, use the results to generate a new reports and then push the results and the newly generated report.

## Stats

After each report gets generated the report details and all tests results are stored in json data files.
Once a day, a GitHub action runs and (re)generated some stats based on the stored results (see [Stats](https://automattic.github.io/jetpack-e2e-reports/#/charts)).

## Cleanup

A cleanup job runs daily, deleting:

- full reports for pull requests that are closed
- full reports that were not updated in the last 30 days
- test files and attachments referencing tests that are not included in the history list (for each test we keep the last 20 results)

Only report data is deleted.

## Dashboard app

The dashboard app is deployed automatically to GitHub Pages when code is pushed to the repo.
