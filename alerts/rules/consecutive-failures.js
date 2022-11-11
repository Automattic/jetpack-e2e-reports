const { dataSourceURL } = require( '../../src/config.json' );
const { fetchJsonData } = require( '../fetch-data' );

async function consecutiveFailures( reportName, threshold ) {
	console.log( `Running 'trunk_consecutive_failures' rule` );
	console.log( `Checking for consecutive ${ threshold } failures in ${ reportName }` );

	if(process.env.REPORT_NAME === 'atomic' || process.env.REPORT_NAME === 'gutenberg') {
		console.log( `Skipping for report ${process.env.REPORT_NAME}` );
		return;
	}

	let message;

	console.log( 'Fetching reports data' );
	const data = await fetchJsonData( `${ dataSourceURL }/data/reports.json` );
	const report = data.reports.find( r => r.name === reportName );

	if ( report ) {
		const history = report.history;
		console.log( `History for '${ reportName }': ${ history }` );
		if (
			history &&
			history.length >= threshold &&
			[ ...new Set( history.substring( history.length - threshold ) ) ].join( '' ).toUpperCase() ===
				'F'
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

			if ( process.env.GITHUB_RUN_ID ) {
				const runId = process.env.GITHUB_RUN_ID;
				context = `Alert created by run <https://github.com/Automattic/jetpack-e2e-reports/actions/runs/${ runId } | ${ runId }>`;
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
							text: context,
						},
					],
				},
			];
		}
	} else {
		console.warn( `Report ${ reportName } not found` );
	}

	return message;
}

module.exports = {
	consecutiveFailures,
};
