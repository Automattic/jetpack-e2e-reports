const { dataSourceURL } = require( '../src/config.json' );

function testRule() {
	return [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: 'It works!',
			},
		},
		{
			type: 'context',
			elements: [
				{
					type: 'plain_text',
					text: 'Context here. This is a test.',
					emoji: false,
				},
			],
		},
		{
			type: 'actions',
			elements: [
				{
					type: 'button',
					text: {
						type: 'plain_text',
						text: 'Action button',
					},
					url: 'https://automattic.github.io/jetpack-e2e-reports/#/charts',
				},
			],
		},
	];
}

async function consecutiveFailures( reportName, threshold ) {
	console.log( `Checking for consecutive ${ threshold } failures in ${ reportName }` );

	return [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `*Tests in ${ reportName } failed in the last ${ threshold } runs!*`,
			},
		},
		{
			type: 'actions',
			elements: [
				{
					type: 'button',
					text: {
						type: 'plain_text',
						text: 'View reports',
					},
					url: `${ dataSourceURL }/reports/trunk/report/index.html`,
				},
			],
		},
	];
}

module.exports = {
	testRule,
	consecutiveFailures,
};
