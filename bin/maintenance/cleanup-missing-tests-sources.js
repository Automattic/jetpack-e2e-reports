/**
 * This script will clean source property pointing to missing files
 */

const { readS3Object, printProgress } = require( '../utils' );
const { s3Params, s3client } = require( '../s3-client' );
const { PutObjectCommand } = require( '@aws-sdk/client-s3' );
const dataFile = 'data/tests.json';

( async () => {
	const json = JSON.parse( ( await readS3Object( dataFile ) ).toString() );

	let results = 0;
	let sources = 0;
	let removed = 0;
	const items = json.tests.map( ( t ) => t.results ).flat();
	for ( const item of items ) {
		results++;

		if ( item.source ) {
			sources++;
			const file = await readS3Object( `reports/${ item.report }/report/data/test-cases/${ item.source }`, true );
			if ( ! file ) {
				// console.log( `Removing source ${ item.source }` );
				delete item.source;
				removed++;
			}
		}
		printProgress( `Checked ${ results }/${ items.length } results. Removed ${ removed }/${ sources } sources.` );
	}

	json.lastUpdate = new Date().toISOString();

	const cmd = new PutObjectCommand( { Bucket: s3Params.Bucket, Key: dataFile, Body: JSON.stringify( json ), ContentType: 'application/json' } );
	await s3client.send( cmd );
} )();
