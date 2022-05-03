const {
	writeJson, readJson,
} = require( './utils' );
const moment = require( 'moment' );

const sourceJson = readJson( 'docs/data/tests.json' );
writeJson( sourceJson, `docs/data/tests-bk-${ moment( new Date() ).format( 'YYYY-MM-DD-hh-mm' ) }.json` );

for ( const test of sourceJson.tests ) {
	console.log( `Processing ${ test.name }` );
	const lastMonthResults = [];

	for ( const srcResult of test.results ) {
		const monthSuffix = moment( srcResult.time ).format( 'YYYY-MM' );

		const monthlyJson = readJson( `docs/data/tests-${ monthSuffix }.json` ) || {
			tests: [],
		};

		const existingTest = monthlyJson.tests.filter(
			( t ) => t.name === test.name
		);

		if ( existingTest.length === 0 ) {
			// test doesn't exist in the monthly json
			// create the test with this result
			console.log( `Adding new test in ${ monthSuffix } json: '${ test.name }'` );

			monthlyJson.tests.push( { name: test.name, results: [ srcResult ] } );
		} else {
			// test exists in the monthly json
			// push the result
			console.log( `Test '${ test.name }' exists in ${ monthSuffix } json` );
			const existingResult = existingTest[ 0 ].results.filter(
				( r ) => r.time === srcResult.time
			);

			if ( existingResult.length === 0 ) {
				console.log( `Adding result ${ JSON.stringify( srcResult ) } for test '${ test.name }'` );
				existingTest[ 0 ].results.push( srcResult );
			} else {
				console.log( `Result already exists: test: ${ test.name }, result ${ JSON.stringify( srcResult ) }` );
			}
		}

		if ( moment( srcResult.time ).isAfter( moment().subtract( 1, 'month' ) ) ) {
			console.log( `Result is from the last month: ${ srcResult.time }, keeping it` );
			lastMonthResults.push( srcResult );
		}

		//todo this could be optimised so we only write once on the disk
		writeJson( monthlyJson, `docs/data/tests-${ monthSuffix }.json` );
	}

	test.results = lastMonthResults;
}

writeJson( sourceJson, 'docs/data/tests.json' );
