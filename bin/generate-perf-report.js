const fs = require( 'fs' );
const path = require( 'path' );
const resultsDir = `${ process.env.RESULTS_PATH }/test-output-block-perf`;
const baseReport = path.resolve( resultsDir, 'base.test.results.json' );
const jetpackReport = path.resolve( resultsDir, 'jetpack.test.results.json' );
const perfMetricsFile = 'docs/data/perf-metrics.json';

/**
 * Loops through the performance report, and calculates an average per key
 *
 * @param {string} file path to the performance report
 * @return {Object} Object containing averages
 */
function calculateAverageFor( file ) {
	const contents = JSON.parse( fs.readFileSync( file ) );

	return Object.entries( contents ).reduce( ( prev, [ key, arr ] ) => {
		const average = arr.reduce( ( p, v ) => p + v ) / arr.length;
		prev[ key ] = Math.round( average * 100 ) / 100;
		return prev;
	}, {} );
}

function main() {
	const metricsObj = JSON.parse( fs.readFileSync( perfMetricsFile ) );

	const baseAvg = calculateAverageFor( baseReport );
	const jetpackAvg = calculateAverageFor( jetpackReport );

	metricsObj.push( {
		baseAvg,
		jetpackAvg,
		date: Date.now(),
	} );

	fs.writeFileSync(
		path.resolve( perfMetricsFile ),
		JSON.stringify( metricsObj, null, 2 )
	);
}

main();
