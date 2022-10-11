const { setFailed, getInput } = require( '@actions/core' );
const { postMessage } = require( './slack' );
const { testRule, consecutiveFailures } = require( './rules' );

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

	//region rules
	const rules = [
		{
			name: 'test_rule',
			impl: testRule(),
		},
		{
			name: 'trunk_consecutive_failures',
			impl: consecutiveFailures( 'trunk', 1 ),
		},
	];
	//endregion

	const rule = rules.find( ( { name } ) => name === ruleName );

	if ( ! rule ) {
		console.warn( `No rule defined for '${ ruleName }'` );
		return;
	}

	const message = await rule.impl;

	if ( message ) {
		console.log( `Sending alert for rule '${ ruleName }'` );
		await postMessage( slackToken, channel, message );
	} else {
		console.log( `No alert to send for rule '${ ruleName }'` );
	}
} )();
