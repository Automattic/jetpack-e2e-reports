const fs = require( 'fs' );
const path = require( 'path' );
const { execSync } = require( 'child_process' );
const { getReportsDirs } = require( './utils' );

const json = { reports: [] };

for ( const dirName of getReportsDirs() ) {
	// get the statistics from report/widgets/reports.json
	const filePath = path.resolve( 'docs', dirName, 'report/widgets/summary.json' );

	let summaryData;
	try {
		summaryData = fs.readFileSync( filePath );
	} catch ( err ) {
		console.error( `Cannot read ${ filePath } ${ err }` );
		continue;
	}

	const statistic = JSON.parse( summaryData.toString() ).statistic;

	// metadata

	let metadata = {
		branch: '',
		pr_number: '',
		pr_title: '',
		run_id: '',
		run_number: '',
		updated_on: '',
	};

	try {
		const fileData = fs.readFileSync( `docs/${ dirName }/metadata.json` );
		metadata = JSON.parse( fileData.toString() );
	} catch ( error ) {
		if ( error.code === 'ENOENT' ) {
		} else {
			console.error( error );
		}
	}

	const size = execSync( `du -sh docs/${ dirName } | cut -f1` ).toString().replace( /\n$/, '' );
	const report = {
		name: dirName,
		lastUpdate: metadata.updated_on ? metadata.updated_on : '1970-01-01',
		statistic,
		metadata,
		size,
	};

	// console.log( report );

	json.reports.push( report );
}

json.reportsCount = json.reports.length;

// get the size of the docs folder
const docsSize = execSync( 'du -sh docs | cut -f1' ).toString().replace( /\n$/, '' );
json.docsSize = docsSize;

fs.writeFileSync( path.resolve( 'docs/data/reports.json' ), JSON.stringify( json, null, 2 ) );
