const {
	getReportsDirs,
	getFilesFromDir,
	getTestInfoFromTestCaseFile,
	writeJson,
	sort,
} = require( '../src/utils' );
const moment = require( 'moment' );
const fs = require( 'fs' );

const dailyDataFile = 'docs/data/daily.json';
const weeklyDataFile = 'docs/data/weekly.json';
const dailyJson = JSON.parse( fs.readFileSync( dailyDataFile ).toString() );
const weeklyJson = JSON.parse( fs.readFileSync( weeklyDataFile ).toString() );

for ( const dirName of getReportsDirs() ) {
	const dirPath = `docs/${ dirName }/report/data/test-cases`;

	for ( const testFile of getFilesFromDir( dirPath, '.json' ) ) {
		// console.log( `Reading test files for report ${ dirName }` );
		const testInfo = getTestInfoFromTestCaseFile( dirName, testFile );
		const date = moment( testInfo.time.stop ).format( 'YYYY-MM-DD' );
		const week = `${ moment(
			testInfo.time.stop
		).isoWeekYear() }-week-${ moment( testInfo.time.stop ).isoWeek() }`;

		pushData( dailyJson, date, testInfo );
		pushData( weeklyJson, week, testInfo );
	}
}

dailyJson.sort( ( a, b ) => {
	return new Date( b.date ) - new Date( a.date );
} );

sort( weeklyJson, 'date', true );

writeJson( dailyJson, dailyDataFile );
writeJson( weeklyJson, weeklyDataFile );

function pushData( data, date, testInfo ) {
	const existingKey = data.filter( ( k ) => k.date === date );

	if ( existingKey.length > 0 ) {
		existingKey[ 0 ][
			testInfo.status === 'broken' ? 'failed' : testInfo.status
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

		entry[ testInfo.status === 'broken' ? 'failed' : testInfo.status ]++;
		entry.total++;

		data.push( entry );
	}
}
