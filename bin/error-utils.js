const moment = require( 'moment' );

const DAYS_TO_KEEP_TEST_RESULT_FOR_ERROR = 30;
const DAYS_SINCE_LAST_OCCURENCE_TO_KEEP_ERROR = 7;
const DAYS_TO_KEEP_ERRORS_WITH_SINGLE_RESULT = 3;

function cleanTrace( trace ) {
	return trace
		.split( '\n' )
		.filter( line => ! line.includes( '=====' ) )
		.filter( line => ! line.includes( 'Playwright logs' ) )
		.filter( line => ! line.includes( '/node_modules/' ) )
		.filter( line => ! line.includes( 'node:' ) )
		.filter( line => ! line.includes( 'runMicrotasks' ) )
		.join( '\n' )
		.replace( /\n+/g, '\n' )
		.replace( /at .+/gs, trace.match( /at .+/ ) ) // keep only the first "at" line
		.replace( /Call log:(?:\n\s*-.+){3,}/g, 'Call log: [...]' )
		.replace( /(https?:\/\/)?[^\s]+\.a8c-localtunnel\.cyou/g, 'SITE-URL' )
		.replace( /(https?:\/\/)?[^\s]+\.trycloudflare\.com/g, 'SITE-URL' )
		.replace( /cookie: .*/gi, 'cookie: [...]' )
		.replace(
			/waiting for selector "\.wp-block-jetpack-.+ \.components-sandbox" to be visible/g,
			'waiting for selector ".wp-block-jetpack-BLOCK .components-sandbox" to be visible'
		)
		.replace(
			/waiting for selector "#block-.* a\[href\*=\'calypso-marketing-connections\'\]" to be visible/g,
			'waiting for selector "#block-... a[href*=\'calypso-marketing-connections\']" to be visible'
		)
		.replace( /partner_id=\S+/g, 'partner_id=***' )
		.replace( /partner_secret=\S+/g, 'partner_secret=***' )
		.replace(
			/ms exceeded\.\n.*at SearchHomepage.waitForLoadState/gs,
			'ms exceeded.\n    at SearchHomepage.waitForLoadState'
		); // remove multiple possible events that can happen before timeout
}

function cleanError( message, trace ) {
	if ( trace ) {
		return trace.includes( message )
			? cleanTrace( trace )
			: cleanTrace( `${ message }\n${ trace }` );
	}
	return 'undefined';
}

async function cleanupErrors( jsonData ) {
	// First, update latestOccurrence for all errors based on actual result times
	jsonData.errors.forEach( e => {
		if ( e.results && e.results.length > 0 ) {
			const timeValues = e.results.map( r => r.time );
			const momentTimes = timeValues.map( t => moment( t ) );
			const newLatestOccurrence = moment.max( momentTimes ).valueOf();

			if ( e.latestOccurrence !== newLatestOccurrence ) {
				e.latestOccurrence = newLatestOccurrence;
				console.log( `Updated latestOccurrence to ${ newLatestOccurrence }` );
			}
		}
	} );

	// Sort the errors by latest occurrence (most recent first)
	jsonData.errors.sort( ( a, b ) => {
		if ( ! a.latestOccurrence || ! b.latestOccurrence ) {
			return 0;
		}
		return b.latestOccurrence - a.latestOccurrence;
	} );

	jsonData.errors = jsonData.errors.filter( e => {
		// Remove old results first
		const originalResultsCount = e.results.length;
		e.results = e.results.filter(
			result =>
				moment.duration( moment.utc().diff( moment.utc( result.time ) ) ).as( 'days' ) <
				DAYS_TO_KEEP_TEST_RESULT_FOR_ERROR
		);

		const removedResultsCount = originalResultsCount - e.results.length;
		if ( removedResultsCount > 0 ) {
			console.log(
				`Removed ${ removedResultsCount } old results from error: ${ e.trace?.substring(
					0,
					50
				) }...`
			);
		}

		// Remove errors without results
		if ( ! e.results || e.results.length === 0 ) {
			console.log( `Removing error with no results: ${ e.trace?.substring( 0, 50 ) }...` );
			return false;
		}

		// Remove errors with single result older than 3 days
		if ( e.results.length === 1 ) {
			const resultDate = moment( e.results[ 0 ].date );
			const daysSinceResult = moment().diff( resultDate, 'days' );
			if ( daysSinceResult > DAYS_TO_KEEP_ERRORS_WITH_SINGLE_RESULT ) {
				console.log(
					`Removing error with single result older than ${ DAYS_TO_KEEP_ERRORS_WITH_SINGLE_RESULT } days: ${ e.trace?.substring(
						0,
						50
					) }...`
				);
				return false;
			}
		}

		// Remove errors with no occurrences in the days threshold
		if ( e.results && e.results.length > 0 ) {
			const daysSinceLastOccurrence = moment
				.duration( moment.utc().diff( moment.utc( e.latestOccurrence ) ) )
				.as( 'days' );
			if ( daysSinceLastOccurrence > DAYS_SINCE_LAST_OCCURENCE_TO_KEEP_ERROR ) {
				console.log(
					`Removing error with last occurrence older than ${ DAYS_SINCE_LAST_OCCURENCE_TO_KEEP_ERROR } days: ${ e.trace?.substring(
						0,
						50
					) }...`
				);
				return false;
			}
		}

		return true;
	} );

	// Only keep the last 500 errors
	if ( jsonData.errors.length > 500 ) {
		console.log( `Keeping only the last 500 errors` );
		jsonData.errors = jsonData.errors.slice( -500 );
	}

	// Calculate oldest timestamp across all errors
	let oldestTimestamp = jsonData.oldestTimestamp || null;
	for ( const error of jsonData.errors ) {
		for ( const result of error.results ) {
			if ( oldestTimestamp === null || result.time < oldestTimestamp ) {
				oldestTimestamp = result.time;
			}
		}
	}

	jsonData.oldestTimestamp = oldestTimestamp;
	jsonData.lastUpdate = new Date().toISOString();
	return jsonData;
}

module.exports = { cleanupErrors, cleanTrace, cleanError };
