const { s3Params, s3client } = require( '../s3-client' );
const { PutObjectCommand } = require( '@aws-sdk/client-s3' );
const { readS3Object, printProgress } = require( '../utils' );
const { cleanTrace, cleanupErrors } = require( '../error-utils' );
const readline = require( 'readline' );

( async () => {
	// const dataFile = './public/data/errors.json';
	// let json = JSON.parse( fs.readFileSync( dataFile ).toString() );
	let json = JSON.parse( ( await readS3Object( 'data/errors.json' ) ).toString() );

	const mergedErrors = [];

	let checked = 0;
	for ( const error of json.errors ) {
		error.trace = cleanTrace( error.trace );

		const existingErrors = mergedErrors.filter( e => e.trace === error.trace );

		if ( existingErrors.length > 0 ) {
			existingErrors[ 0 ].results = existingErrors[ 0 ].results.concat( error.results );
		} else {
			mergedErrors.push( error );
		}

		checked++;
		printProgress( `Checked ${ checked } errors` );
	}

	// ensure unique results for each error
	let total = 0;
	for ( const error of mergedErrors ) {
		const unique = error.results.filter( ( err, i ) => {
			return (
				error.results.findIndex( e => {
					return e.time === err.time && e.report === err.report && e.test === err.test;
				} ) === i
			);
		} );

		total += error.results.length - unique.length;
		error.results = unique;
	}

	console.log();
	console.log( total );

	console.log( `Merged errors: ${ json.errors.length - mergedErrors.length }` );
	json.errors = mergedErrors;
	json.lastUpdate = new Date();

	// writeJson( json, dataFile );

	json = await cleanupErrors( json );

	// Ask for confirmation before uploading to S3
	const rl = readline.createInterface( {
		input: process.stdin,
		output: process.stdout,
	} );

	const answer = await new Promise( resolve => {
		rl.question( `Upload merged and cleaned errors to S3? (y/N): `, resolve );
	} );

	rl.close();

	if ( answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes' ) {
		console.log( 'Uploading to S3...' );
		const cmd = new PutObjectCommand( {
			Bucket: s3Params.Bucket,
			Key: 'data/errors.json',
			Body: JSON.stringify( json ),
			ContentType: 'application/json',
		} );
		await s3client.send( cmd );
		console.log( 'Upload completed!' );
	} else {
		console.log( 'Upload cancelled.' );
	}
} )();
