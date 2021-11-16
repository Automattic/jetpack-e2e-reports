const fs = require( 'fs' );
const path = require( 'path' );
const {
	getReportsDirs,
	getFilesFromDir,
	getTestInfoFromTestCaseFile,
} = require( './utils' );
const moment = require( 'moment' );

const json = [];

for ( const dirName of getReportsDirs() ) {
	const dirPath = `docs/${ dirName }/report/data/test-cases`;

	for ( const testFile of getFilesFromDir( dirPath, '.json' ) ) {
		// console.log( `Reading test files for report ${ dirName }` );
		const testInfo = getTestInfoFromTestCaseFile( dirName, testFile );
		const date = moment( testInfo.time.stop ).format( 'YYYY-MM-DD' );

		const existingDate = json.filter( ( d ) => d.date === date );

		if ( existingDate.length > 0 ) {
			existingDate[ 0 ][
				testInfo.status === 'broken' ? 'failed' : testInfo.status
			]++;
			existingDate[ 0 ].total++;
		} else {
			const day = {
				date,
				passed: 0,
				failed: 0,
				skipped: 0,
				total: 0,
			};

			day[ testInfo.status === 'broken' ? 'failed' : testInfo.status ]++;
			day.total++;

			json.push( day );
		}
	}
}

json.sort( ( a, b ) => {
	return new Date( b.date ) - new Date( a.date );
} );

if ( process.env.CLEAN_DATA ) {
	fs.writeFileSync( path.resolve( 'docs/data/daily.json' ), '' );
}

fs.writeFileSync(
	path.resolve( 'docs/data/daily.json' ),
	JSON.stringify( json )
);
