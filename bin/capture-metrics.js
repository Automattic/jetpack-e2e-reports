const fs = require( 'fs' );
const path = require( 'path' );

const reportDir = 'docs/master/report/';

const metricsObj = JSON.parse( fs.readFileSync( `docs/metrics.json` ) );
const runSummary = JSON.parse(
	fs.readFileSync( `${ reportDir }/widgets/summary.json` )
);

delete runSummary.reportName;
delete runSummary.testRuns;

function getFailedTests() {
	const suites = JSON.parse(
		fs.readFileSync( `${ reportDir }/data/suites.json` )
	).children[ 0 ].children;

	const tests = suites.reduce( ( acc, fileResults ) => {
		const fileTests = fileResults.children.map( ( ch ) => {
			ch.file_name = fileResults.name;
			return ch;
		} );
		acc.push( ...fileTests );
		return acc;
	}, [] );

	const failedTests = tests.filter( ( t ) =>
		[ 'failed', 'broken' ].includes( t.status )
	);
	console.log( JSON.stringify( tests ) );

	return failedTests.map( ( t ) => {
		const testCase = JSON.parse(
			fs.readFileSync( `${ reportDir }/data/test-cases/${ t.uid }.json` )
		);

		const trace = testCase.statusTrace
			.split( '\n' )
			.filter( ( line ) => ! line.includes( '=====' ) )
			.filter( ( line ) => ! line.includes( 'Playwright logs' ) )
			.join( '\n' );
		t.error = {
			statusMessage: testCase.statusMessage,
			statusTrace: trace,
		};
		return t;
	} );
}

const failedTests = getFailedTests();

metricsObj.stats.push( runSummary );
metricsObj.failedTests.push( ...failedTests );

fs.writeFileSync(
	path.resolve( 'docs/metrics.json' ),
	JSON.stringify( metricsObj, null, 2 )
);
