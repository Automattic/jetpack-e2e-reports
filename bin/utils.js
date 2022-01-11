const fs = require( 'fs' );
const path = require( 'path' );

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

function getFilesFromDir( dirPath, fileExtension = '' ) {
	return fs
		.readdirSync( dirPath, {
			withFileTypes: true,
		} )
		.filter(
			( dirent ) =>
				dirent.isFile() && dirent.name.endsWith( fileExtension )
		)
		.map( ( dirent ) => dirent.name );
}

function cleanTrace( trace ) {
	return trace
		.split( '\n' )
		.filter( ( line ) => ! line.includes( '=====' ) )
		.filter( ( line ) => ! line.includes( 'Playwright logs' ) )
		.filter( ( line ) => ! line.includes( '/node_modules/' ) )
		.filter( ( line ) => ! line.includes( 'node:' ) )
		.filter( ( line ) => ! line.includes( 'runMicrotasks' ) )
		.join( '\n' )
		.replace( /\n+/g, '\n' )
		.replace( /https:\/\/.+.a8c-localtunnel.cyou/g, 'SITE-URL' )
		.replace(
			/waiting for selector "\.wp-block-jetpack-.+ \.components-sandbox" to be visible/g,
			'waiting for selector ".wp-block-jetpack-BLOCK .components-sandbox" to be visible'
		)
		.replace( /at .+/gs, trace.match( /at .+/ ) ) // keep only the first "at" line
		.replace( /ms exceeded\.\n.*at SearchHomepage.waitForLoadState/gs, 'ms exceeded.\n    at SearchHomepage.waitForLoadState' ); // remove multiple possible events that can happen before timeout
}

function getTestInfoFromTestCaseFile( reportName, fileName ) {
	const filePath = `./docs/${ reportName }/report/data/test-cases/${ fileName }`;
	return JSON.parse( fs.readFileSync( filePath ).toString() );
}

function writeJson( jsonData, filePath, pretty = false ) {
	fs.writeFileSync(
		path.resolve( filePath ),
		JSON.stringify( jsonData, null, pretty ? 2 : 0 )
	);
}

function sort( data, sortKey, desc = false ) {
	const sorted = data.sort( ( a, b ) =>
		// eslint-disable-next-line no-nested-ternary
		a[ sortKey ] > b[ sortKey ] ? 1 : b[ sortKey ] > a[ sortKey ] ? -1 : 0
	);

	if ( desc ) {
		return sorted.reverse();
	}

	return sorted;
}

/**
 * Removes the source property of each element in an array of objects of the file corresponding to the source doesn't exist
 * Expected object structure: {report: xx, source: xx}
 *
 * @param {Array} arr
 */
function cleanSources( arr ) {
	arr.forEach( ( item ) => {
		if ( item.source ) {
			const sourcePath = `docs/${ item.report }/report/data/test-cases/${ item.source }`;
			if ( ! fs.existsSync( sourcePath ) ) {
				console.log( `${ sourcePath } not found, removing source` );
				delete item.source;
			}
		}
	} );
}

module.exports = {
	getReportsDirs,
	getFilesFromDir,
	getTestInfoFromTestCaseFile,
	cleanTrace,
	writeJson,
	sort,
	cleanSources,
};
