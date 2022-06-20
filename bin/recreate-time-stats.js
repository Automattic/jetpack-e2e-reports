/**
 * This script will re-create per time unit statistics data files: daily, weekly and monthly. It should run on a schedule, probably on a daily basis.
 * It reads the data from the tests-YYYY-MM.json files
 */

const { sort, readS3Object, listS3Objects } = require( './utils' );
const moment = require( 'moment' );
const { PutObjectCommand } = require( '@aws-sdk/client-s3' );
const { s3Params, s3client } = require( './s3-client' );
const trunkReports = require( '../src/config.json' ).trunkRuns;
const resultsTemplate = '{ "passed": 0, "failed": 0, "skipped": 0, "total": 0 }';

( async () => {
	const srcData = { tests: [] };
	const s3DataFiles = await listS3Objects( 'data' );
	const testsDataFiles = s3DataFiles.filter( fileName => fileName.startsWith( 'data/tests-' ) );

	for ( const dataFile of testsDataFiles ) {
		const monthSrcData = JSON.parse( ( await readS3Object( `${ dataFile }` ) ).toString() );
		srcData.tests = srcData.tests.concat( monthSrcData.tests );
	}

	const dailyJson = [];
	const weeklyJson = [];
	const monthlyJson = [];
	const summaryData = {
		stats: {
			'24h': { trunk: JSON.parse( resultsTemplate ), total: JSON.parse( resultsTemplate ) },
			'7d': { trunk: JSON.parse( resultsTemplate ), total: JSON.parse( resultsTemplate ) },
			'14d': { trunk: JSON.parse( resultsTemplate ), total: JSON.parse( resultsTemplate ) },
			'30d': { trunk: JSON.parse( resultsTemplate ), total: JSON.parse( resultsTemplate ) },
		},
		lastUpdate: '',
	};

	for ( const test of srcData.tests ) {
		for ( const result of test.results ) {
			const date = moment.utc( result.time ).format( 'YYYY-MM-DD' );
			const week = moment.utc( result.time ).format( 'GGGG-[week]-WW' );
			const month = moment.utc( result.time ).format( 'YYYY-MM' );

			pushData( dailyJson, date, result );
			pushData( weeklyJson, week, result );
			pushData( monthlyJson, month, result );

			const duration = moment
				.duration( moment.utc().diff( moment.utc( result.time ) ) )
				.as( 'days' );

			// console.log( `${ result.time } => ${ moment.utc( result.time ).format( 'YYYY-MM-DD hh:mm:ss' ) } => ${ duration } days ago` );

			if ( duration <= 1 ) {
				updateSummaryEntry( summaryData.stats[ '24h' ], result );
			}

			if ( duration <= 7 ) {
				updateSummaryEntry( summaryData.stats[ '7d' ], result );
			}

			if ( duration <= 14 ) {
				updateSummaryEntry( summaryData.stats[ '14d' ], result );
			}

			if ( duration <= 30 ) {
				updateSummaryEntry( summaryData.stats[ '30d' ], result );
			}

			summaryData.lastUpdate = new Date().toISOString();
		}
	}

	dailyJson.sort( ( a, b ) => {
		return new Date( b.date ) - new Date( a.date );
	} );

	sort( weeklyJson, 'date', true );

	await uploadData( 'data/results-daily.json', dailyJson );
	await uploadData( 'data/results-weekly.json', weeklyJson );
	await uploadData( 'data/results-monthly.json', monthlyJson );
	await uploadData( 'data/summary.json', summaryData );
} )();

async function uploadData( dataFile, jsonData ) {
	console.log( `Updating file ${ dataFile }` );
	const cmd = new PutObjectCommand( {
		Bucket: s3Params.Bucket,
		Key: dataFile,
		Body: JSON.stringify( jsonData ),
		ContentType: 'application/json',
	} );
	await s3client.send( cmd );
}

function updateSummaryEntry( entry, result ) {
	const isTrunk = trunkReports.includes( result.report );

	if ( isTrunk ) {
		entry.trunk[ result.status === 'broken' ? 'failed' : result.status ]++;
		entry.trunk.total++;
	} else {
		entry.total[ result.status === 'broken' ? 'failed' : result.status ]++;
		entry.total.total++;
	}
}

function pushData( data, date, result ) {
	let entry = data.filter( k => k.date === date );

	if ( entry.length === 0 ) {
		data.push( {
			date,
			trunk: JSON.parse( resultsTemplate ),
			total: JSON.parse( resultsTemplate ),
		} );

		entry = data.filter( k => k.date === date );
	}

	const isTrunk = trunkReports.includes( result.report );

	if ( isTrunk ) {
		entry[ 0 ].trunk[ result.status === 'broken' ? 'failed' : result.status ]++;
		entry[ 0 ].trunk.total++;
	}

	entry[ 0 ].total[ result.status === 'broken' ? 'failed' : result.status ]++;
	entry[ 0 ].total.total++;
}
