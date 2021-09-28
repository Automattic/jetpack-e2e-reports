const fs = require( 'fs' );
const path = require( 'path' );
const reportDir = 'docs/master/report/';
const metricsFile = 'docs/metrics.json';

/**
 * Pull metadata for the failed tests from data/test-cases/UID.json for each failed test,
 *
 * @return {Array} Array of objects of failed test cases.
 */
function getFailedTests() {
	const suites = JSON.parse(
		fs.readFileSync( `${ reportDir }/data/suites.json` )
	).children[ 0 ].children;

	const tests = suites.reduce( ( acc, fileResults ) => {
		const fileTests = fileResults.children.map( ( ch ) => {
			ch.fileName = fileResults.name;
			return ch;
		} );
		acc.push( ...fileTests );
		return acc;
	}, [] );

	const failedTests = tests.filter( ( t ) =>
		[ 'failed', 'broken' ].includes( t.status )
	);

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

/**
 * Check if two summary objects are the same, comparing by the start/stop timestampts
 *
 * @param {Object} lastRecord last record from Metrics file
 * @param {Object} newRecord Run summary pulled from summary.json
 * @return {boolean} whether two reports are identical
 */
function isDuplicateRecord( lastRecord, newRecord ) {
	if ( ! lastRecord || ! lastRecord.time ) {
		return false;
	}
	return (
		lastRecord.time.start === newRecord.time.start &&
		lastRecord.time.stop === newRecord.time.stop
	);
}

function main() {
	const metricsObj = JSON.parse( fs.readFileSync( metricsFile ) );
	const runSummary = JSON.parse(
		fs.readFileSync( `${ reportDir }/widgets/summary.json` )
	);

	if (
		isDuplicateRecord(
			metricsObj.stats[ metricsObj.stats.length - 1 ],
			runSummary
		)
	) {
		return;
	}

	delete runSummary.reportName;
	delete runSummary.testRuns;

	const failedTests = getFailedTests();

	metricsObj.stats.push( runSummary );
	metricsObj.failedTests.push( ...failedTests );

	fs.writeFileSync(
		path.resolve( metricsFile ),
		JSON.stringify( metricsObj, null, 2 )
	);
}

main();
