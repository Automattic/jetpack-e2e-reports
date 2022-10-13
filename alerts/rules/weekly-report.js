const { dataSourceURL } = require( '../../src/config.json' );
const { fetchJsonData } = require( '../fetch-data' );

async function weeklyReport() {
	console.log( "'Running 'weekly_report' rule'" );

	const summaryData = await fetchJsonData( `${ dataSourceURL }/data/summary.json` );

	const summaryContextElements = [];
	for ( const key of Object.keys( summaryData.stats ) ) {
		const trunkStats = summaryData.stats[ key ].trunk;
		const rate = ( ( trunkStats.failed / trunkStats.total ) * 100 ).toFixed( 2 );
		summaryContextElements.push( {
			type: 'mrkdwn',
			text: `*${ key }*: ${ rate }%`,
		} );
	}

	const testsWithFailures = ['Test one	10%', 'Test two	7%', 'Test three	2.5%'];

	const message = [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `:information_source: Weekly`,
			},
		},
		{
			type: 'context',
			elements: summaryContextElements,
		},
		{
			type: 'context',
			elements: [
				{
					type: 'mrkdwn',
					text: `Tests with failures since last report:\n${ testsWithFailures.join('\n') }`,
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
						text: 'See more',
					},
					url: 'https://automattic.github.io/jetpack-e2e-reports',
				},
			],
		},
		{
			type: 'context',
			elements: [
				{
					type: 'plain_text',
					text: `Summary data last updated at ${ summaryData.lastUpdate }. Only test runs on trunk are included.`,
				},
			],
		},
	];

	return message;
}

module.exports = {
	weeklyReport,
};
