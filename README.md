[![Reports status](https://img.shields.io/website?down_color=grey&down_message=Dashboard%20offline&style=for-the-badge&label=E2E%20TEST%20REPORTS&up_color=green&up_message=see%20dashboard&url=https%3A%2F%2Fautomattic.github.io%2Fjetpack-e2e-reports%2F%23%2F)](https://automattic.github.io/jetpack-e2e-reports)

# Jetpack e2e test reports

This repo contains a suite of scripts used to generate Allure reports for test runs, some data files with test results stats and the code for a dashboard displaying the data from those files.

## Accessing reports

You can find all the available reports by checking the [reports list](https://automattic.github.io/jetpack-e2e-reports/).

## How it works

All reports are stored in an Amazon S3 bucket.

The tests run in [Jetpack monorepo](https://github.com/Automattic/jetpack) CI. At the end of the E2E tests job suite a repository dispatch event is sent to this repo with all the required information about the test run, triggering the report workflow.

The reports are generated using [Allure](http://allure.qatools.ru) framework. Allure results in json format are being created by the tests and are stored as artefacts in GitHub after each test run. The workflow in this repo will download the artefacts, use the results to generate a new reports and then push the results and the newly generated report in the configured S3 bucket.

The 

## Stats

After each report gets generated the report details and all tests results are stored in json data files.
Once a day, a GitHub action runs and (re)generated some stats based on the stored results (see [Stats](https://automattic.github.io/jetpack-e2e-reports/#/charts)).

## Cleanup

A cleanup job runs daily, deleting:

- full reports for pull requests that are closed
- full reports that were not updated in the last 60 days
- test files and attachments referencing tests that are not included in the history list (for each test we keep the last 20 results, as Allure only displays the last 20 results).

Some reports are configured as "permanent", and they are never fully deleted, only their old results are being cleaned.

## Dashboard app

The dashboard app is deployed automatically to GitHub Pages when code is pushed to the repo.
