const fs = require( 'fs' );
const path = require( 'path' );
const { execSync } = require( 'child_process' );

const excluded = [ 'static' ];
const json = { reports: [] };

const dirs = fs
	.readdirSync( 'docs', { withFileTypes: true } )
	.filter( ( dirent ) => dirent.isDirectory() )
	.map( ( dirent ) => dirent.name );

for ( const dirName of dirs ) {
	// Skip excluded dirs
	if ( excluded.includes( dirName ) ) {
		continue;
	}

	// get the last update date from git log
	const lastUpdate = execSync(
		`git log -1 --format=\"%ad\" ${ path.resolve( 'docs', dirName ) }`
	)
		.toString()
		.replace( /\n$/, '' );

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
		lastUpdate,
		statistic,
		metadata,
	};

	// console.log( report );

	json.reports.push( report );
}

fs.writeFileSync(
	path.resolve( 'src/summary.json' ),
	JSON.stringify( json, null, 2 )
);
