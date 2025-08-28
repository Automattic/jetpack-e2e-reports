/**
 * This script will update the json file containing the list of errors: data/errors.json
 * It will take the data of a recently generated report that exists on the disk, and push this data in the existing json file
 * It will read data from files in $reportID/report/data/test-cases
 */

const { readS3Object, readJson, cleanError, getLocalReportsPaths } = require( './utils' );
const path = require( 'path' );
const { PutObjectCommand } = require( '@aws-sdk/client-s3' );
const { s3Params, s3client } = require( './s3-client' );
const moment = require( 'moment' );

const DAYS_TO_KEEP_TEST_RESULT_FOR_ERROR = 30;
const DAYS_SINCE_LAST_OCCURENCE_TO_KEEP_ERROR = 7;
const DAYS_TO_KEEP_ERRORS_WITH_SINGLE_RESULT = 3;
const reports = getLocalReportsPaths();
let json = { errors: [] };

( async () => {
	// Get the existing errors list
	json = JSON.parse( ( await readS3Object( 'data/errors.json' ) ).toString() );

	for ( const reportPath of reports ) {
		await addErrorsFromReport( reportPath );
	}
	
	// Sort the errors by latest occurrence (most recent first)
	json.errors.sort( ( a, b ) => {
		if ( ! a.latestOccurrence || ! b.latestOccurrence ) {
			return 0;
		}
		return b.latestOccurrence - a.latestOccurrence;
	} );

	// Clean up

	json.errors = json.errors.filter( e => {
		// Remove old results first
		console.log( `Removing results older than ${ DAYS_TO_KEEP_TEST_RESULT_FOR_ERROR } days and cleaning up errors` );
		e.results = e.results.filter(
			result =>
				moment.duration( moment.utc().diff( moment.utc( result.time ) ) ).as( 'days' ) <
				DAYS_TO_KEEP_TEST_RESULT_FOR_ERROR
		);

		// Remove errors without results
		if ( ! e.results || e.results.length === 0 ) {
			console.log( `Removing error with no results: ${ e.trace?.substring( 0, 50 ) }...` );
			return false;
		}

		// Remove errors with single result older than 3 days
		if ( e.results.length === 1 ) {
			const resultDate = moment( e.results[ 0 ].date );
			const daysSinceResult = moment().diff( resultDate, 'days' );
			if ( daysSinceResult > DAYS_TO_KEEP_ERRORS_WITH_SINGLE_RESULT ) {
				console.log(
					`Removing error with single result older than ${ DAYS_TO_KEEP_ERRORS_WITH_SINGLE_RESULT } days: ${ e.trace?.substring( 0, 50 ) }...`
				);
				return false;
			}
		}

		// Remove errors with no occurrences in the days threshold
		if ( e.results && e.results.length > 0 ) {
			const mostRecentTime = Math.max( ...e.results.map( r => r.time ) );
			const daysSinceLastOccurrence = moment.duration( moment.utc().diff( moment.utc( mostRecentTime ) ) ).as( 'days' );
			if ( daysSinceLastOccurrence > DAYS_SINCE_LAST_OCCURENCE_TO_KEEP_ERROR ) {
				console.log(
					`Removing error with last occurrence older than ${ DAYS_SINCE_LAST_OCCURENCE_TO_KEEP_ERROR } days: ${ e.trace?.substring( 0, 50 ) }...`
				);
				return false;
			}
		}

		return true;
	} );

	// Only keep the last 500 errors
	if ( json.errors.length > 500 ) {
		console.log( `Keeping only the last 500 errors` );
		json.errors = json.errors.slice( -500 );
	}

	// Calculate oldest timestamp across all errors
	let oldestTimestamp = json.oldestTimestamp || null;
	for ( const error of json.errors ) {
		for ( const result of error.results ) {
			if ( oldestTimestamp === null || result.time < oldestTimestamp ) {
				oldestTimestamp = result.time;
			}
		}
	}

	json.oldestTimestamp = oldestTimestamp;
	json.lastUpdate = new Date().toISOString();

	// Write the updated errors list locally
	// writeJson( json, path.join( "", 'errors.json' ) );

	// Upload the report to S3
	const cmd = new PutObjectCommand( {
		Bucket: s3Params.Bucket,
		Key: 'data/errors.json',
		Body: JSON.stringify( json ),
		ContentType: 'application/json',
	} );
	await s3client.send( cmd );
} )();

async function addErrorsFromReport( reportPath ) {
	const reportId = path.basename( reportPath );

	// Get the list of failures from  report/widgets/status-chart.json
	const status = readJson( path.join( reportPath, 'report/widgets/status-chart.json' ) );
	const failedTests = status.filter( t => t.status === 'failed' || t.status === 'broken' );
	console.log( `Found ${ failedTests.length } failed tests` );

	for ( const test of failedTests ) {
		console.log( `Reading ${ test.uid }` );
		const testInfo = readJson(
			path.join( reportPath, 'report/data/test-cases', `${ test.uid }.json` )
		);

		if ( ( ! testInfo.statusTrace && ! testInfo.statusMessage ) || testInfo.status === 'skipped' ) {
			continue;
		}

		const existingError = json.errors.filter(
			e => e.trace === cleanError( testInfo.statusMessage, testInfo.statusTrace )
		);

		const result = {
			time: testInfo.time.stop,
			report: reportId,
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
				existingError[ 0 ].results.sort( ( a, b ) => b.time - a.time );
				// eslint-disable-next-line dot-notation
				existingError[ 0 ][ 'latestOccurrence' ] = Math.max( ...existingError[ 0 ].results.map( r => r.time ) );
			} else {
				console.log( 'The result already exists. Nothing will be added' );
			}
		} else {
			// Create a new entry for this error
			const error = {
				trace: cleanError( testInfo.statusMessage, testInfo.statusTrace ),
				results: [],
				latestOccurrence: '',
			};

			console.log( 'Creating new error entry' );
			error.results.push( result );
			error.results.sort( ( a, b ) => b.time - a.time );
			error.latestOccurrence = result.time;

			json.errors.push( error );
		}
	}
}
