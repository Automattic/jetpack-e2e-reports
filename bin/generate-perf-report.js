const path = require( 'path' );
const { PutObjectCommand } = require( '@aws-sdk/client-s3' );
const { s3Params, s3client } = require( './s3-client' );
const { readJson } = require( './utils' );
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
	const contents = readJson( file );

	return Object.entries( contents ).reduce( ( prev, [ key, arr ] ) => {
		const average = arr.reduce( ( p, v ) => p + v ) / arr.length;
		prev[ key ] = Math.round( average * 100 ) / 100;
		return prev;
	}, {} );
}

( async () => {
	const metricsObj = readJson( perfMetricsFile );
	const baseAvg = calculateAverageFor( baseReport );
	const jetpackAvg = calculateAverageFor( jetpackReport );

	metricsObj.push( {
		baseAvg,
		jetpackAvg,
		date: Date.now(),
	} );

	// fs.writeFileSync(
	// 	path.resolve( perfMetricsFile ),
	// 	JSON.stringify( metricsObj, null, 2 )
	// );

	// Upload the report to S3
	console.log( 'Updating file data/perf-metrics.json' );
	const cmd = new PutObjectCommand( {
		Bucket: s3Params.Bucket,
		Key: 'data/perf-metrics.json',
		Body: JSON.stringify( metricsObj ),
		ContentType: 'application/json',
	} );
	await s3client.send( cmd );
} )();
