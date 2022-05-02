const fs = require( 'fs' );
const {
	getReportsDirs,
	cleanTrace,
	getFilesFromDir,
	getTestInfoFromTestCaseFile,
	cleanSources,
	writeJson,
} = require( './utils' );

const dataFile = 'docs/data/errors.json';
const json = JSON.parse( fs.readFileSync( dataFile ).toString() );

function cleanError( message, trace ) {
	if ( trace ) {
		return trace.includes( message ) ? cleanTrace( trace ) : cleanTrace( `${ message }\n${ trace }` );
	}
	return 'undefined';
}

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

		if (
			( ! testInfo.statusTrace && ! testInfo.statusMessage ) ||
			testInfo.status === 'skipped'
		) {
			continue;
		}

		const existingError = json.errors.filter(
			( e ) =>
				e.trace ===
				cleanError( testInfo.statusMessage, testInfo.statusTrace )
		);

		const masterReports = require( '../src/config.json' ).masterRuns;

		const result = {
			time: testInfo.time.stop,
			report: dirName,
			isMaster: masterReports.includes( dirName ),
			source: testInfo.source,
			test: testInfo.fullName,
		};

		if ( existingError.length > 0 ) {
			const existingReport = existingError[ 0 ].results.filter(
				( t ) => t.time === testInfo.time.stop
			);

			if ( existingReport.length === 0 ) {
				existingError[ 0 ].results.push( result );
			}
		} else {
			const error = {
				trace: cleanError(
					testInfo.statusMessage,
					testInfo.statusTrace
				),
				results: [],
			};

			error.results.push( result );

			json.errors.push( error );
		}
	}
}

// clean missing sources
cleanSources( json.errors.map( ( e ) => e.results ).flat() );

json.lastUpdate = new Date();

writeJson( json, dataFile );
