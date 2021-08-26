[![Reports status](https://img.shields.io/website?down_color=grey&down_message=Dashboard%20offline&style=for-the-badge&label=E2E%20TEST%20REPORTS&up_color=green&up_message=see%20dashboard&url=https%3A%2F%2Fautomattic.github.io%2Fjetpack-e2e-reports%2F%23%2F)](https://automattic.github.io/jetpack-e2e-reports)

# Jetpack e2e test reports

This repo contains test reports for Jetpack e2e tests and the code used to create and maintain such reports.

## Accessing reports

All reports are stored in the `docs` folder which is served by Github Pages. A different folder exists for each report, the name used being the pull request number or the branch name for which the tests ran.

The reports urls have the following pattern: https://automattic.github.io/jetpack-e2e-reports/{PR_NUMBER}/report

Use the PR number or branch name (only for main branch - currently `master`) to access a test report.

## Dashboard

[A dashboard](https://automattic.github.io/jetpack-e2e-reports/) was implemented to ease the discovery of the stored reports. The dashboard gets updated every time a new report gets pushed.

## How it works

The tests run in [Jetpack monorepo](https://github.com/Automattic/jetpack) CI. At the end of the E2E tests job suite a repository dispatch event is sent to this repo with all the required information about the test run, triggering the report workflow.

The reports are generated using [Allure](http://allure.qatools.ru) framework. Allure results in json format are being created by the tests and are stored as artefacts in Github after each test run. The workflow in this repo will download the artefacts, use the results to generate a new reports and then push the results and the newly generated report.


## Cleanup

A cleanup job runs twice every day, deleting:
- full reports for pull requests that are closed
- full reports that were not updated in the last 45 days
- test results and attachments referencing tests that are not included in the history list (for each test we keep the last 20 results)

