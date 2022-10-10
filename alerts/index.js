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

	//region check rules
	const rules = [
		{
			name: 'test_rule',
			message: testRule(),
		},
		{
			name: 'trunk_consecutive_failures',
			message: consecutiveFailures( 'trunk', 3 ),
		},
	];
	//endregion

	const rule = rules.find( ( { name } ) => name === ruleName );

	if ( ! rule ) {
		console.warn( `No rule defined for ${ ruleName }` );
		return;
	}

	const message = await rule.message;

	if ( message ) {
		await postMessage( slackToken, channel, message );
	} else {
		console.log( `No message to send for rule ${ ruleName }` );
	}
} )();
