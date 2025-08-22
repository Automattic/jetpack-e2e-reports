// Utility functions for efficient data processing

/**
 * Creates a deep copy of data using structuredClone when available,
 * falling back to JSON methods for older browsers
 *
 * @param {*} obj - The object to clone
 * @return {*} Deep cloned object
 */
export function deepClone( obj ) {
	if ( typeof structuredClone !== 'undefined' ) {
		return structuredClone( obj );
	}
	return JSON.parse( JSON.stringify( obj ) );
}

/**
 * Efficiently filters and processes test data
 *
 * @param {Array}  tests   - Array of test objects
 * @param {Object} filters - Filter configuration
 * @return {Array}  Processed test data
 */
export function processTestData( tests, filters ) {
	if ( ! tests || ! Array.isArray( tests ) ) return [];

	const { startDate, endDate, selectedReport } = filters;

	return tests
		.map( test => ( {
			...test,
			results: test.results.filter( result => {
				// Date filtering
				if ( startDate && endDate ) {
					const resultTime = new Date( result.time );
					const start = new Date( startDate );
					const end = new Date( endDate );
					if ( resultTime < start || resultTime > end ) return false;
				}

				// Report filtering
				if ( selectedReport === 'total' ) return true;
				if ( selectedReport === 'trunk' ) {
					// Import config dynamically to access trunkRuns
					const config = require( '../config' ).default;
					return config.trunkRuns?.includes( result.report ) || false;
				}
				return result.report === selectedReport;
			} ),
		} ) )
		.filter( test => test.results.length > 0 )
		.map( test => {
			// Calculate statistics
			const statusCounts = test.results.reduce(
				( acc, result ) => {
					acc[ result.status ] = ( acc[ result.status ] || 0 ) + 1;
					acc.total++;
					return acc;
				},
				{ passed: 0, failed: 0, skipped: 0, total: 0 }
			);

			const failedRate =
				statusCounts.total > 0
					? ( ( statusCounts.failed / statusCounts.total ) * 100 ).toFixed( 2 )
					: '0.00';

			return {
				...test,
				...statusCounts,
				failedRate,
				results: test.results.sort( ( a, b ) => a.time - b.time ),
			};
		} );
}

/**
 * Efficiently processes error data
 *
 * @param {Array}  errors  - Array of error objects
 * @param {Object} filters - Filter configuration
 * @return {Array}  Processed error data
 */
export function processErrorData( errors, filters ) {
	if ( ! errors || ! Array.isArray( errors ) ) return [];

	const { startDate, endDate, selectedReport } = filters;

	return errors
		.map( error => ( {
			...error,
			results: error.results.filter( result => {
				// Report filtering first (more selective)
				if ( selectedReport === 'trunk' ) {
					const config = require( '../config' ).default;
					if ( ! config.trunkRuns?.includes( result.report ) ) return false;
				} else if ( selectedReport !== 'total' && result.report !== selectedReport ) {
					return false;
				}

				// Date filtering
				if ( startDate && endDate ) {
					const resultTime = new Date( result.time );
					const start = new Date( startDate );
					const end = new Date( endDate );
					if ( resultTime < start || resultTime > end ) return false;
				}

				return true;
			} ),
		} ) )
		.filter( error => error.results.length > 0 )
		.map( error => {
			const times = error.results.map( r => r.time );
			const testNames = [ ...new Set( error.results.map( r => r.test ) ) ];

			return {
				...error,
				total: error.results.length,
				newest: Math.max( ...times ),
				oldest: Math.min( ...times ),
				tests: testNames.map( testName => {
					const resultsForTest = error.results.filter( r => r.test === testName );
					return {
						name: testName,
						times: resultsForTest.map( r => r.time ),
					};
				} ),
			};
		} );
}

/**
 * Batch multiple state updates into a single update
 *
 * @param {Function} setState - React setState function
 * @param {Object}   updates  - Object containing state updates
 */
export function batchStateUpdates( setState, updates ) {
	setState( prevState => ( { ...prevState, ...updates } ) );
}
