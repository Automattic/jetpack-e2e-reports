/**
 * This script will update the json file containing the list of errors: data/errors.json
 * It will take the data of a recently generated report that exists on the disk, and push this data in the existing json file
 * It will read data from files in $reportID/report/data/test-cases
 */

const { readS3Object, readJson, getFilesFromDir, cleanError } = require( './utils' );
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

	// Get the report statistics from report/widgets/summary.json
	const statistic = readJson( path.join( reportId, 'report/widgets/summary.json' ) ).statistic;

	if ( statistic.failed === 0 && statistic.broken === 0 ) {
		console.log( 'No new failures found' );
		return;
	}

	// Get the list of test files
	const tcPath = `${ reportId }/report/data/test-cases`;
	let testFiles = [];

	try {
		testFiles = getFilesFromDir( tcPath, '.json' );
	} catch ( err ) {
		console.error( `Cannot read files from path ${ tcPath } ${ err }` );
		return;
	}

	for ( const testFile of testFiles ) {
		console.log( `Reading ${ testFile }` );
		const testInfo = readJson( path.join( reportId, 'report/data/test-cases', testFile ) );

		if (
			( ! testInfo.statusTrace && ! testInfo.statusMessage ) ||
			testInfo.status === 'skipped'
		) {
			continue;
		}

		const existingError = json.errors.filter(
			( e ) =>
				e.trace ===
				cleanError( testInfo.statusMessage, testInfo.statusTrace )
		);

		const masterReports = require( '../src/config.json' ).masterRuns;

		const result = {
			time: testInfo.time.stop,
			report: reportId,
			isMaster: masterReports.includes( reportId ),
			source: testInfo.source,
			test: testInfo.fullName,
		};

		if ( existingError.length > 0 ) {
			// The error already exists, we just need to update the result
			console.log( `Updating error ${ existingError[ 0 ].trace }` );
			const existingReport = existingError[ 0 ].results.filter(
				( t ) => t.time === testInfo.time.stop
			);

			if ( existingReport.length === 0 ) {
				// This result is not in the list, we add it
				console.log( 'Adding new result' );
				existingError[ 0 ].results.push( result );
			} else {
				console.log( 'The result already exists. Nothing will be added' );
			}
		} else {
			// Create a new entry for this error
			const error = {
				trace: cleanError(
					testInfo.statusMessage,
					testInfo.statusTrace
				),
				results: [],
			};

			console.log( 'Creating new error entry' );
			error.results.push( result );

			json.errors.push( error );
		}
	}

	json.lastUpdate = new Date().toISOString();

	// Write the updated errors list locally
	// writeJson( json, path.join( reportId, 'errors.json' ) );

	// Upload the report to S3
	const cmd = new PutObjectCommand( { Bucket: s3Params.Bucket, Key: 'data/errors.json', Body: JSON.stringify( json ), ContentType: 'application/json' } );
	await s3client.send( cmd );
} )();
