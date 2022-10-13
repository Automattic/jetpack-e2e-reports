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

	console.log( 'Fetching reports data' );
	await fetch( `${ dataSourceURL }/data/reports.json`, {
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
				console.log( `History for '${ reportName }': ${ history }` );
				if (
					history &&
					history.length >= threshold &&
					[ ...new Set( history.substring( history.length - threshold ) ) ]
						.join( '' )
						.toUpperCase() === 'F'
				) {
					const buttons = [
						{
							type: 'button',
							text: {
								type: 'plain_text',
								text: 'View reports',
							},
							url: `${ dataSourceURL }/reports/trunk/report/index.html`,
						},
					];

					if ( process.env.RUN_ID ) {
						buttons.push( {
							type: 'button',
							text: {
								type: 'plain_text',
								text: 'Tests run',
							},
							url: `https://github.com/Automattic/jetpack/actions/runs/${ process.env.RUN_ID }`,
						} );
					}

                    let context = ' ';

                    if (process.env.GITHUB_RUN_ID) {
                        const runId = process.env.GITHUB_RUN_ID;
                        context = `Alert created by run <https://github.com/Automattic/jetpack-e2e-reports/actions/runs/${runId} | ${runId}>`
                    }

					message = [
						{
							type: 'section',
							text: {
								type: 'mrkdwn',
								text: `:exclamation: There are ${ threshold } consecutive test runs with failures in *${ reportName }*!`,
							},
						},
                        {
                            type: 'actions',
                            elements: buttons,
                        },
                        {
                            type: 'context',
                            elements: [
                                {
                                    type: 'mrkdwn',
                                    text: context
                                }
                                ],
                        }
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
