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

module.exports = {
	getReportsDirs,
	cleanStacktrace,
};
