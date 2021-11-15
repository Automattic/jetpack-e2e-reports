const fs = require( 'fs' );
const path = require( 'path' );
const { getReportsDirs, cleanStacktrace } = require( './utils' );

const json = { errors: [], lastUpdate: '' };

for ( const dirName of getReportsDirs() ) {
	const dirPath = `docs/${ dirName }/report/data/test-cases`;
	const testFiles = fs
		.readdirSync( dirPath, {
			withFileTypes: true,
		} )
		.filter(
			( dirent ) => dirent.isFile() && dirent.name.endsWith( '.json' )
		)
		.map( ( dirent ) => dirent.name );

	for ( const testFile of testFiles ) {
		// console.log( `Reading test files for report ${ dirName }` );
		const filePath = `./docs/${ dirName }/report/data/test-cases/${ testFile }`;
		const testInfo = JSON.parse( fs.readFileSync( filePath ).toString() );

		if (
			( ! testInfo.statusTrace && ! testInfo.statusMessage ) ||
			testInfo.status === 'skipped'
		) {
			continue;
		}

		const existingError = json.errors.filter(
			( e ) =>
				e.trace ===
				cleanStacktrace( testInfo.statusMessage, testInfo.statusTrace )
		);

		if ( existingError.length > 0 ) {
			const existingReport = existingError[ 0 ].results.filter(
				( t ) => t.time === testInfo.time.stop
			);

			if ( existingReport.length === 0 ) {
				existingError[ 0 ].results.push( {
					time: testInfo.time.stop,
					report: dirName,
					source: testInfo.source,
					test: testInfo.fullName,
				} );
			}
		} else {
			const error = {
				trace: cleanStacktrace(
					testInfo.statusMessage,
					testInfo.statusTrace
				),
				results: [],
			};

			error.results.push( {
				time: testInfo.time.stop,
				report: dirName,
				source: testInfo.source,
				test: testInfo.fullName,
			} );

			json.errors.push( error );
		}
	}
}

json.lastUpdate = new Date();
// console.log( JSON.stringify( json, null, 2 ) );

if ( process.env.CLEAN_DATA ) {
	fs.writeFileSync( path.resolve( 'docs/data/errors.json' ), '' );
}

fs.writeFileSync(
	path.resolve( 'docs/data/errors.json' ),
	JSON.stringify( json )
);
