/**
 * This script will create per time unit statistics data files: daily, weekly and monthly. It should run on a schedule, probably on a daily basis.
 * It reads the data from the tests-YYYY-MM.json files
 */

const moment = require( 'moment' );

( async () => {
	const results = [ 1649024555211, 1649859218642, 1650491483131, 1652261686217 ];
	for ( const result of results ) {
		const duration = moment.duration( moment.utc().diff( moment.utc( result ) ) ).as( 'days' );

		console.log( '-------------------------------------------------------' );
		console.log( `${ result } => ${ moment.utc( result ).format( 'YYYY-MM-DD hh:mm:ss' ) } --> ${ duration }` );

		if ( duration <= 1 ) {
			console.log( '24h' );
		}

		if ( duration <= 7 ) {
			console.log( '7d' );
		}

		if ( duration <= 30 ) {
			console.log( '30d' );
		}
	}
} )();
