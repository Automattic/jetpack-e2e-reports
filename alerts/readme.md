# Alerts

There are two types of Slack alerts implemented:

- consecutive failures alerts
- weekly report

The consecutive failures alerts are sent when a report has a number of consecutive failures that is greater than a given threshold. 

The weekly report is sent every Friday and contains a list of tests that had failures in the previous 7 days in the trunk runs.

There is also a test rule implemented as an example and can be used a template for other rules.

## Add a new consecutive failures alert

If you want to include a new report for which to send a consecutive failures alert you need to add a new entry in the `rules` object in `index.js`. To be picked up and run by the `alerts` job in the `reports` workflow, the name of the new entry needs to be `consecutive_failures_{reportname}`, where `{reportname}` needs to be the valid name of the report for which the workflow ran.

## Add a new type of alert

- implement the alert in the `rules` folder (you can use `rules/test-rule.js` as an example)
- add a new entry in the `rules` object in `index.js`
- add the rule as a step in a GitHub action workflow. Remember to set the `slack_token`, `slack_channel` and `rule_name` inputs.
Example:
```yaml
      - name: Send report
        with:
          slack_token: ${{ secrets.SLACK_TOKEN }}
          slack_channel: ${{ secrets.SLACK_CHANNEL_ID }}
          rule_name: "weekly_report"
        uses: ./alerts
```
