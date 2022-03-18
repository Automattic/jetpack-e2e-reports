const { writeJson, sort } = require( './utils' );
const moment = require( 'moment' );
const fs = require( 'fs' );

const srcDataFile = 'docs/data/tests.json';
const dailyDataFile = 'docs/data/daily.json';
const weeklyDataFile = 'docs/data/weekly.json';
const dailyJson = [];
const weeklyJson = [];

const srcData = JSON.parse( fs.readFileSync( srcDataFile ).toString() );

for ( const test of srcData.tests ) {
	for ( const result of test.results ) {
		const date = moment( result.time ).format( 'YYYY-MM-DD' );
		const week = moment( result.time ).format( 'GGGG-[week]-WW' );

		pushData( dailyJson, date, result );
		pushData( weeklyJson, week, result );
	}
}

dailyJson.sort( ( a, b ) => {
	return new Date( b.date ) - new Date( a.date );
} );

sort( weeklyJson, 'date', true );

writeJson( dailyJson, dailyDataFile );
writeJson( weeklyJson, weeklyDataFile );

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
