/**
 * This script will update the json file containing the list of tests: data/tests.json and tests-YYYY-MM.json
 * It will take the data of a recently generated report that exists on the disk, and push this data in the existing json files
 * It will read data from files in $reportID/report/data/test-cases
 */

const { readS3Object, readJson, getFilesFromDir } = require( './utils' );
const path = require( 'path' );
const { PutObjectCommand } = require( '@aws-sdk/client-s3' );
const { s3Params, s3client } = require( './s3-client' );
const moment = require( 'moment' );

const reportId = process.env.REPORT_ID;

if ( ! reportId ) {
	throw 'REPORT_ID env variable is not set';
}

async function addTestsToList( dataFile ) {
	// Get the existing tests list
	console.log();
	console.log( `Reading tests list from ${ dataFile }` );
	const s3Data = await readS3Object( dataFile );
	const json = s3Data ? JSON.parse( s3Data.toString() ) : { tests: [] };

	// Get the list of tests from  report/data/test-cases
	const testFiles = getFilesFromDir( `${ reportId }/report/data/test-cases`, '.json' );
	console.log( `Found ${ testFiles.length } tests` );

	for ( const testFile of testFiles ) {
		console.log( `Reading ${ testFile }` );
		const testInfo = readJson( `${ reportId }/report/data/test-cases/${ testFile }` );

		const testResult = {
			time: testInfo.time.stop,
			report: reportId,
			status:
				testInfo.status === 'broken'
					? 'failed'
					: testInfo.status,
			source: testInfo.source,
		};

		const existingTests = json.tests.filter(
			( t ) => t.name === testInfo.fullName
		);

		if ( existingTests.length > 0 ) {
			// test already exists
			const existingResults = existingTests[ 0 ].results.filter(
				( t ) => t.time === testInfo.time.stop
			);

			if ( existingResults.length === 0 ) {
				// result doesn't exists, push it
				console.log( `Adding result ${ JSON.stringify( testResult ) } for test ${ testInfo.fullName }` );
				existingTests[ 0 ].results.push( testResult );
			} else {
				console.log( `Result ${ JSON.stringify( testResult ) } already exists for test ${ testInfo.fullName }` );
			}
		} else {
			// test doesn't exist, add it and this result
			console.log( `Adding test ${ testInfo.fullName } with result ${ JSON.stringify( testResult ) }` );
			const test = {
				name: testInfo.name,
				results: [ testResult ],
			};

			json.tests.push( test );
		}
	}

	json.lastUpdate = new Date().toISOString();

	// Upload the report to S3
	console.log( `Uploading updated tests list to ${ dataFile }` );
	const cmd = new PutObjectCommand( { Bucket: s3Params.Bucket, Key: dataFile, Body: JSON.stringify( json ), ContentType: 'application/json' } );
	await s3client.send( cmd );
}

( async () => {
	await addTestsToList( 'data/tests.json' );
	// Take the time when test execution ended and decide in which monthly test list to add the results
	// We ignore the possibility of the suite to run in between months and having results in 2 months
	const stopTime = readJson( path.join( reportId, 'report/widgets/summary.json' ) ).time.stop;
	const monthlyFile = moment( stopTime ).format( 'YYYY-MM' );
	await addTestsToList( `data/tests-${ monthlyFile }.json` );
} )();
