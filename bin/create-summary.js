const fs = require( 'fs' );
const path = require( 'path' );
const { execSync } = require( 'child_process' );

const dirs = fs
	.readdirSync( 'docs', { withFileTypes: true } )
	.filter( ( dirent ) => dirent.isDirectory() )
	.map( ( dirent ) => dirent.name );

const json = { reports: [] };

for ( const dirName of dirs ) {
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

	const report = { name: dirName, lastUpdate, statistic };
	console.log( report );

	json.reports.push( report );
}

fs.writeFileSync(
	path.resolve( 'src/summary.json' ),
	JSON.stringify( json, null, 2 )
);
