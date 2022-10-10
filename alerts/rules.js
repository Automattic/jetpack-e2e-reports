const { dataSourceURL } = require( '../src/config.json' );
const fetch = require( 'node-fetch' );

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
	let message;

	fetch( `${ dataSourceURL }/data/reports.json`, {
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	} )
		.then( response => response.json() )
		.then( data => {
			const report = data.reports.find( r => r.name === reportName );

			if ( report ) {
				const history = report.history;
				if (
					history &&
					history.length >= threshold &&
					[...new Set(history.substring( history.length - threshold ))].join("").toUpperCase() === 'FP'
				) {
					message = [
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
			} else {
				console.warn( `Report ${ reportName } not found` );
			}
		} )
		.catch( console.log );

	return message;
}

module.exports = {
	testRule,
	consecutiveFailures,
};
