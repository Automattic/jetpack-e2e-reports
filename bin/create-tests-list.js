const fs = require( 'fs' );
const path = require( 'path' );
const { getReportsDirs } = require( './utils' );

const json = { tests: [], lastUpdate: '' };

for ( const dirName of getReportsDirs() ) {
	// get the tests from report/data/test-cases
	const testFiles = fs
		.readdirSync( `docs/${ dirName }/report/data/test-cases`, {
			withFileTypes: true,
		} )
		.filter(
			( dirent ) => dirent.isFile() && dirent.name.endsWith( '.json' )
		)
		.map( ( dirent ) => dirent.name );

	for ( const testFile of testFiles ) {
		// console.log( `Reading test files for report ${ dirName }` );

		const testInfo = JSON.parse(
			fs
				.readFileSync(
					`./docs/${ dirName }/report/data/test-cases/${ testFile }`
				)
				.toString()
		);

		const existingTest = json.tests.filter(
			( t ) => t.name === testInfo.fullName
		);

		if ( existingTest.length > 0 ) {
			// console.log( `Test "${ testInfo.name }" already exists` );

			const result = {
				time: testInfo.time.stop,
				report: dirName,
				status:
					testInfo.status === 'broken' ? 'failed' : testInfo.status,
			};

			const existingResult = existingTest[ 0 ].results.filter(
				( t ) => t.time === testInfo.time.stop
			);
			if ( existingResult.length === 0 ) {
				existingTest[ 0 ].results.push( result );
			}
		} else {
			const test = {
				name: testInfo.name,
				results: [],
			};

			const result = {
				time: testInfo.time.stop,
				report: dirName,
				status:
					testInfo.status === 'broken' ? 'failed' : testInfo.status,
			};

			test.results.push( result );
			json.tests.push( test );
		}
	}
}

json.lastUpdate = new Date();
// console.log( JSON.stringify( json, null, 2 ) );

fs.writeFileSync(
	path.resolve( 'docs/data/tests.json' ),
	JSON.stringify( json, null, 1 )
);
