#!/usr/bin/env node

/**
 * Helper script to extract values from config.js for shell scripts
 * Usage: node get-config-value.js <property>
 * Example: node get-config-value.js reportDeepUrl
 */

const configModule = require( '../src/config.js' );
const config = configModule.default || configModule;
const property = process.argv[ 2 ];
const format = process.argv[ 3 ] || 'default';

if ( ! property ) {
	console.error( 'Property name is required' );
	process.exit( 1 );
}

if ( ! ( property in config ) ) {
	console.error( `Property '${ property }' not found in config` );
	process.exit( 1 );
}

const value = config[ property ];

if ( format === 'lines' && Array.isArray( value ) ) {
	// Output array items one per line for shell script mapfile usage
	value.forEach( item => console.log( item ) );
} else {
	console.log( value );
}
