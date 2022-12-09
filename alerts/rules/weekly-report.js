const { dataSourceURL } = require( '../../src/config.json' );
const { fetchJsonData } = require( '../fetch-data' );
const moment = require( 'moment' );

async function weeklyReport() {
	console.log( "'Running 'weekly_report' rule'" );

	const summaryData = await fetchJsonData( `${ dataSourceURL }/data/summary.json` );
	const testsData = await fetchJsonData( `${ dataSourceURL }/data/tests.json` );

	const summaryContextElements = [];
	for ( const key of Object.keys( summaryData.stats ) ) {
		const trunkStats = summaryData.stats[ key ].trunk;
		const rate = ( ( trunkStats.failed / trunkStats.total ) * 100 ).toFixed( 2 );
		summaryContextElements.push( `${ key }: ${ rate }%` );
	}

	// remove results older than 7 days and not from trunk
	testsData.tests.forEach( entry => {
		entry.results = entry.results.filter(
			result =>
				moment.duration( moment.utc().diff( moment.utc( result.time ) ) ).as( 'days' ) < 7 &&
				result.report === 'trunk'
		);
	} );

	const testsWithFailures = [];

	testsData.tests.forEach( entry => {
		const failures = entry.results.filter( result => result.status === 'failed' );
		if ( failures.length > 0 ) {
			const rate = ( ( failures.length / entry.results.length ) * 100 ).toFixed( 2 );
			testsWithFailures.push( {
				name: entry.name,
				rate,
				toString() {
					return `${ this.rate }%	${ this.name }`;
				},
			} );
		}
	} );

	testsWithFailures.sort( ( a, b ) => b.rate - a.rate );
	const testsLimit = 10;

	const testsListText =
		testsWithFailures.length > testsLimit
			? `*${
					testsWithFailures.length
			  } tests failed in the last 7 days. Here are ${ testsLimit } with worst failure rates:*\n\n${ testsWithFailures
					.slice( 0, 9 )
					.join( '\n' ) }`
			: `*${
					testsWithFailures.length
			  } tests failed in the last 7 days:*\n\n${ testsWithFailures.join( '\n' ) }`;

	return [
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `:information_source: \tEnd-to-end tests results summary\n\n`,
			},
		},
		{
			type: 'divider',
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: `*Failure rates:*\n${ summaryContextElements.join( '\t' ) }`,
			},
		},
		{
			type: 'divider',
		},
		{
			type: 'section',
			text: {
				type: 'mrkdwn',
				text: testsListText,
			},
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
					url: 'https://automattic.github.io/jetpack-e2e-reports/#/tests',
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
}

module.exports = {
	weeklyReport,
};
