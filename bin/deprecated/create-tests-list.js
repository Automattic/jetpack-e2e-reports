const fs = require( 'fs' );
const path = require( 'path' );
const {
	getReportsDirs,
	getFilesFromDir,
	getTestInfoFromTestCaseFile,
	cleanSources,
	writeJson,
} = require( './utils' );

const dataFilePath = path.resolve( 'docs/data/tests.json' );
// const json = { tests: [], lastUpdate: '' };
const json = JSON.parse( fs.readFileSync( dataFilePath ).toString() );

for ( const dirName of getReportsDirs() ) {
	const dirPath = `docs/${ dirName }/report/data/test-cases`;
	let testFiles = [];

	try {
		testFiles = getFilesFromDir( dirPath, '.json' );
	} catch ( err ) {
		console.error( `Cannot read files from path ${ dirPath } ${ err }` );
		continue;
	}

	for ( const testFile of testFiles ) {
		const testInfo = getTestInfoFromTestCaseFile( dirName, testFile );

		const existingTest = json.tests.filter(
			( t ) => t.name === testInfo.fullName
		);

		if ( existingTest.length > 0 ) {
			// test already exists
			const existingResult = existingTest[ 0 ].results.filter(
				( t ) => t.time === testInfo.time.stop
			);

			if ( existingResult.length === 0 ) {
				// result doesn't exists, push it
				existingTest[ 0 ].results.push( {
					time: testInfo.time.stop,
					report: dirName,
					status:
						testInfo.status === 'broken'
							? 'failed'
							: testInfo.status,
					source: testInfo.source,
				} );
			}
		} else {
			// test doesn't exist
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

// clean missing sources
cleanSources( json.tests.map( ( t ) => t.results ).flat() );

json.lastUpdate = new Date();

writeJson( json, dataFilePath );
