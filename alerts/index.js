const { setFailed, getInput } = require( '@actions/core' );
const { postMessage } = require( './slack' );
const { testRule } = require( './rules/test-rule' );
const { consecutiveFailures } = require( './rules/consecutive-failures' );
const { weeklyReport } = require( './rules/weekly-report' );

( async function main() {
	//region validate input
	const slackToken = getInput( 'slack_token' );
	if ( ! slackToken ) {
		setFailed( 'Input `slack_token` is required' );
		return;
	}

	const channel = getInput( 'slack_channel' );
	if ( ! channel ) {
		setFailed( 'Input `slack_channel` is required' );
		return;
	}

	const ruleName = getInput( 'rule_name' );
	if ( ! ruleName ) {
		setFailed( 'Input `rule_name` is required' );
		return;
	}
	//endregion

	const rules = {
		test_rule: async () => await testRule(),
		consecutive_failures_trunk: async () => await consecutiveFailures('trunk', 10),
		consecutive_failures_jetpack_production: async () => await consecutiveFailures('jetpack-production', 5),
		consecutive_failures_jetpack_boost_production: async () => await consecutiveFailures('jetpack-boost-production', 5),
		consecutive_failures_jetpack_social_plugin: async () => await consecutiveFailures('jetpack-social-plugin', 5),
		consecutive_failures_jetpack_search_plugin: async () => await consecutiveFailures('jetpack-search-plugin', 5),
		consecutive_failures_atomic: async () => await consecutiveFailures('atomic', 5),
		consecutive_failures_gutenberg: async () => await consecutiveFailures('gutenberg', 5),
		weekly_report: async () => await weeklyReport(),
	};

	if ( ! Object.keys( rules ).find( name => name === ruleName ) ) {
		console.warn( `No rule defined for '${ ruleName }'` );
		return;
	}

	const message = await rules[ ruleName ]();

	if ( message ) {
		console.log( `Sending alert for rule '${ ruleName }'` );
		await postMessage( slackToken, channel, message );
	} else {
		console.log( `No alert to send for rule '${ ruleName }'` );
	}
} )();
