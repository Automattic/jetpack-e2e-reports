const fs = require( 'fs' );
const path = require( 'path' );
const { execSync } = require( 'child_process' );

const excluded = require( '../config.json' ).ignore;

const json = { reports: [] };

const dirs = fs
	.readdirSync( 'docs', { withFileTypes: true } )
	.filter( ( dirent ) => dirent.isDirectory() )
	.map( ( dirent ) => dirent.name );

for ( const dirName of dirs ) {
	// Skip excluded dirs
	if ( excluded.includes( dirName ) ) {
		console.log( `Ignore ${ dirName }` );
		continue;
	}

	// get the statistics from report/widgets/summary.json
	const summaryData = fs.readFileSync(
		path.resolve( 'docs', dirName, 'report/widgets/summary.json' )
	);
	const statistic = JSON.parse( summaryData ).statistic;

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
		metadata = JSON.parse( fileData );
	} catch ( error ) {
		if ( error.code === 'ENOENT' ) {
		} else {
			console.error( error );
		}
	}

	const report = {
		name: dirName,
		lastUpdate: metadata.updated_on ? metadata.updated_on : '1970-01-01',
		statistic,
		metadata,
	};

	// console.log( report );

	json.reports.push( report );
}

json.reportsCount = json.reports.length;

// get the size of the docs folder
const docsSize = execSync( 'du -sh docs | cut -f1' )
	.toString()
	.replace( /\n$/, '' );
json.docsSize = docsSize;

fs.writeFileSync(
	path.resolve( 'docs/summary.json' ),
	JSON.stringify( json, null, 2 )
);
