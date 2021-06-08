const fs = require( 'fs' );
const path = require( 'path' );
const { execSync } = require( 'child_process' );

const dirs = fs
	.readdirSync( 'docs', { withFileTypes: true } )
	.filter( ( dirent ) => dirent.isDirectory() )
	.map( ( dirent ) => dirent.name );

const json = { reports: [] };

for ( const dirName of dirs ) {
	const lastUpdate = execSync(
		`git log -1 --format=\"%ad\" ${ path.resolve( 'docs', dirName ) }`
	)
		.toString()
		.replace( /\n$/, '' );

	const report = { name: dirName, lastUpdate };
	console.log( report );

	json.reports.push( report );
}

fs.writeFileSync(
	path.resolve( 'src/summary.json' ),
	JSON.stringify( json, null, 2 )
);
