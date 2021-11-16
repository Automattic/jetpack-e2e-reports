const fs = require( 'fs' );
const path = require( 'path' );
const {
	getReportsDirs,
	getFilesFromDir,
	getTestInfoFromTestCaseFile,
} = require( './utils' );

const json = { tests: [], lastUpdate: '' };

for ( const dirName of getReportsDirs() ) {
	const dirPath = `docs/${ dirName }/report/data/test-cases`;

	for ( const testFile of getFilesFromDir( dirPath, '.json' ) ) {
		const testInfo = getTestInfoFromTestCaseFile( dirName, testFile );

		const existingTest = json.tests.filter(
			( t ) => t.name === testInfo.fullName
		);

		if ( existingTest.length > 0 ) {
			const existingResult = existingTest[ 0 ].results.filter(
				( t ) => t.time === testInfo.time.stop
			);

			if ( existingResult.length === 0 ) {
				existingTest[ 0 ].results.push( {
					time: testInfo.time.stop,
					report: dirName,
					status:
						testInfo.status === 'broken'
							? 'failed'
							: testInfo.status,
				} );
			}
		} else {
			const test = {
				name: testInfo.name,
				results: [],
			};

			test.results.push( {
				time: testInfo.time.stop,
				report: dirName,
				status:
					testInfo.status === 'broken' ? 'failed' : testInfo.status,
				source: testInfo.source,
			} );

			json.tests.push( test );
		}
	}
}

json.lastUpdate = new Date();
// console.log( JSON.stringify( json, null, 2 ) );

if ( process.env.CLEAN_DATA ) {
	fs.writeFileSync( path.resolve( 'docs/data/tests.json' ), '' );
}

fs.writeFileSync(
	path.resolve( 'docs/data/tests.json' ),
	JSON.stringify( json )
);
