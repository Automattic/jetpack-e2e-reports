const fs = require( 'fs' );
const {
	cleanTrace,
	writeJson,
} = require( '../utils' );

const dataFile = 'docs/data/errors.json';
const json = JSON.parse( fs.readFileSync( dataFile ).toString() );

const mergedErrors = [];

for ( const error of json.errors ) {
	error.trace = cleanTrace( error.trace );

	const existingErrors = mergedErrors.filter( ( e ) => e.trace === error.trace );

	if ( existingErrors.length > 0 ) {
		existingErrors[ 0 ].results = existingErrors[ 0 ].results.concat( error.results );
	} else {
		mergedErrors.push( error );
	}
}

// ensure unique results for each error
let total = 0;
for ( const error of mergedErrors ) {
	const unique = error.results.filter( ( err, i ) => {
		return error.results.findIndex( ( e ) => {
			return e.time === err.time && e.report === err.report && e.test === err.test;
		} ) === i;
	} );

	total += error.results.length - unique.length;
	error.results = unique;
}
console.log( total );

console.log( `Merged errors: ${ json.errors.length - mergedErrors.length }` );
json.errors = mergedErrors;
json.lastUpdate = new Date();

writeJson( json, dataFile );
