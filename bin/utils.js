const fs = require( 'fs' );

function getReportsDirs() {
	const excluded = require( '../src/config.json' ).ignore;
	console.log( `Excluded dirs: ${ excluded }` );

	return fs
		.readdirSync( 'docs', { withFileTypes: true } )
		.filter(
			( dirent ) =>
				dirent.isDirectory() && ! excluded.includes( dirent.name )
		)
		.map( ( dirent ) => dirent.name );
}

module.exports = {
	getReportsDirs,
};
