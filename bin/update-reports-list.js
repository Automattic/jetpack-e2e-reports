/**
 * This script will update the json file containing the list of reports: data/reports.json
 * It will take the data of a recently generated report that exists on the disk, and push this data in the existing json file
 * It will read data from $reportID/report/widgets/summary.json, $reportID/metadata.json
 */

const { readS3Object, readJson } = require( './utils' );
const path = require( 'path' );
const { PutObjectCommand } = require( '@aws-sdk/client-s3' );
const { s3Params, s3client } = require( './s3-client' );

const reportId = process.env.REPORT_ID;

if ( ! reportId ) {
	throw 'REPORT_ID env variable is not set';
}

let json = { reports: [] };

( async () => {
	// Get the existing reports list
	json = JSON.parse( ( await readS3Object( 'data/reports.json' ) ).toString() );

	// Get the report statistics from report/widgets/summary.json
	const statistic = readJson( path.join( reportId, 'report/widgets/summary.json' ) ).statistic;

	// Get the metadata
	const metadata = readJson( path.join( reportId, 'metadata.json' ) ) || {
		branch: '',
		pr_number: '',
		pr_title: '',
		run_id: '',
		run_number: '',
		updated_on: '',
	};

	// Create the report entry
	const report = {
		name: reportId,
		lastUpdate: metadata.updated_on ? metadata.updated_on : '1970-01-01',
		statistic,
		metadata,
	};

	console.log( report );
	const reportIndex = json.reports.findIndex( r => r.name === reportId );

	if ( reportIndex !== -1 ) {
		// Update the report entry in the reports list
		json.reports[ reportIndex ] = report;
	} else {
		// push new report
		json.reports.push( report );
	}

	json.reportsCount = json.reports.length;
	json.lastUpdate = new Date().toISOString();

	// Upload the report to S3
	const cmd = new PutObjectCommand( {
		Bucket: s3Params.Bucket,
		Key: 'data/reports.json',
		Body: JSON.stringify( json, null, 2 ),
		ContentType: 'application/json',
	} );
	await s3client.send( cmd );
} )();
