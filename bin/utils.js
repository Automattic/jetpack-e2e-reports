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

function cleanStacktrace( message, trace ) {
	trace = trace
		.split( '\n' )
		.filter( ( line ) => ! line.includes( '=====' ) )
		.filter( ( line ) => ! line.includes( 'Playwright logs' ) )
		.join( '\n' )
		.replace( /\n+/g, '\n' )
		.replace( /https:\/\/.+.a8c-localtunnel.cyou/g, 'SITE-URL' )
		.replace(
			/waiting for selector "\.wp-block-jetpack-.+ \.components-sandbox" to be visible/g,
			'waiting for selector ".wp-block-jetpack-BLOCK .components-sandbox" to be visible'
		);

	return `${ message }\n${ trace }`;
}

function getTestInfoFromTestCaseFile( reportName, fileName ) {
	const filePath = `./docs/${ reportName }/report/data/test-cases/${ fileName }`;
	return JSON.parse( fs.readFileSync( filePath ).toString() );
}

module.exports = {
	getReportsDirs,
	getFilesFromDir,
	getTestInfoFromTestCaseFile,
	cleanStacktrace,
};
