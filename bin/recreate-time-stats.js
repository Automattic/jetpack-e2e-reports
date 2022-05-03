/**
 * This script will create per time statistics data files: daily, weekly and monthly. It should run on a schedule, probably on a daily basis.
 * It reads the data from the tests-YYYY-MM.json files
 */

const { sort, readS3Object, listS3Objects } = require( './utils' );
const moment = require( 'moment' );
const { PutObjectCommand } = require( '@aws-sdk/client-s3' );
const { s3Params, s3client } = require( './s3-client' );

( async () => {
	const srcData = { tests: [] };
	const s3DataFiles = await listS3Objects( 'data' );
	const tests = s3DataFiles.filter( ( fileName ) => fileName.startsWith( 'data/tests-' ) );

	for ( const dataFile of tests ) {
		const monthSrcData = JSON.parse( ( await readS3Object( `${ dataFile }` ) ).toString() );
		srcData.tests = srcData.tests.concat( monthSrcData.tests );
	}

	const dailyJson = [];
	const weeklyJson = [];
	const monthlyJson = [];

	for ( const test of srcData.tests ) {
		for ( const result of test.results ) {
			const date = moment( result.time ).format( 'YYYY-MM-DD' );
			const week = moment( result.time ).format( 'GGGG-[week]-WW' );
			const month = moment( result.time ).format( 'YYYY-MM' );

			pushData( dailyJson, date, result );
			pushData( weeklyJson, week, result );
			pushData( monthlyJson, month, result );
		}
	}

	dailyJson.sort( ( a, b ) => {
		return new Date( b.date ) - new Date( a.date );
	} );

	sort( weeklyJson, 'date', true );

	await uploadData( 'data/_daily.json', dailyJson );
	await uploadData( 'data/_weekly.json', weeklyJson );
	await uploadData( 'data/_monthly.json', monthlyJson );
} )();

async function uploadData( dataFile, jsonData ) {
	console.log( `Updating file ${ dataFile }` );
	const cmd = new PutObjectCommand( { Bucket: s3Params.Bucket, Key: dataFile, Body: JSON.stringify( jsonData ), ContentType: 'application/json' } );
	await s3client.send( cmd );
}

function pushData( data, date, result ) {
	const existingKey = data.filter( ( k ) => k.date === date );

	if ( existingKey.length > 0 ) {
		existingKey[ 0 ][
			result.status === 'broken' ? 'failed' : result.status
		]++;
		existingKey[ 0 ].total++;
	} else {
		const entry = {
			date,
			passed: 0,
			failed: 0,
			skipped: 0,
			total: 0,
		};

		entry[ result.status === 'broken' ? 'failed' : result.status ]++;
		entry.total++;

		data.push( entry );
	}
}
