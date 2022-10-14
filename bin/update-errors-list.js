/**
 * This script will update the json file containing the list of errors: data/errors.json
 * It will take the data of a recently generated report that exists on the disk, and push this data in the existing json file
 * It will read data from files in $reportID/report/data/test-cases
 */

const { readS3Object, readJson, cleanError } = require( './utils' );
const path = require( 'path' );
const { PutObjectCommand } = require( '@aws-sdk/client-s3' );
const { s3Params, s3client } = require( './s3-client' );

const reportId = process.env.REPORT_ID;

if ( ! reportId ) {
	throw 'REPORT_ID env variable is not set';
}

( async () => {
	// Get the existing errors list
	const json = JSON.parse( ( await readS3Object( 'data/errors.json' ) ).toString() );

	// Get the list of failures from  report/widgets/status-chart.json
	const status = readJson( path.join( reportId, 'report/widgets/status-chart.json' ) );
	const failedTests = status.filter( t => t.status === 'failed' || t.status === 'broken' );
	console.log( `Found ${ failedTests.length } failed tests` );

	for ( const test of failedTests ) {
		console.log( `Reading ${ test.uid }` );
		const testInfo = readJson(
			path.join( reportId, 'report/data/test-cases', `${ test.uid }.json` )
		);

		if ( ( ! testInfo.statusTrace && ! testInfo.statusMessage ) || testInfo.status === 'skipped' ) {
			continue;
		}

		const existingError = json.errors.filter(
			e => e.trace === cleanError( testInfo.statusMessage, testInfo.statusTrace )
		);

		const trunkReports = require( '../src/config.json' ).trunkRuns;

		const result = {
			time: testInfo.time.stop,
			report: reportId,
			isTrunk: trunkReports.includes( reportId ),
			source: testInfo.source,
			test: testInfo.fullName,
		};

		if ( existingError.length > 0 ) {
			// The error already exists, we just need to update the result
			console.log( `Updating error ${ existingError[ 0 ].trace }` );
			const existingReport = existingError[ 0 ].results.filter(
				t => t.time === testInfo.time.stop
			);

			if ( existingReport.length === 0 ) {
				// This result is not in the list, we add it
				console.log( 'Adding new result' );
				existingError[ 0 ].results.push( result );
				existingError.results.sort( ( a, b ) => a.time - b.time );
			} else {
				console.log( 'The result already exists. Nothing will be added' );
			}
		} else {
			// Create a new entry for this error
			const error = {
				trace: cleanError( testInfo.statusMessage, testInfo.statusTrace ),
				results: [],
			};

			console.log( 'Creating new error entry' );
			error.results.push( result );
			error.results.sort( ( a, b ) => a.time - b.time );

			json.errors.push( error );
		}
	}

	json.lastUpdate = new Date().toISOString();

	// Write the updated errors list locally
	// writeJson( json, path.join( reportId, 'errors.json' ) );

	// Upload the report to S3
	const cmd = new PutObjectCommand( {
		Bucket: s3Params.Bucket,
		Key: 'data/errors.json',
		Body: JSON.stringify( json ),
		ContentType: 'application/json',
	} );
	await s3client.send( cmd );
} )();
