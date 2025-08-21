/**
 * This script will clean old reports and reports for closed PRs
 *
 * Usage:
 *   node ./bin/cleanup-s3.js [options]
 *
 * Options:
 *   --skipGitHubStatus    Skip GitHub API calls for fetching PR status and checking individual PRs
 *   --report <name>       Clean up only the specified report and exit
 *   --jsonOnly            Skip checking reports on storage and only clean the data files
 *   --storageOnly         Skip cleaning the data files and only clean reports on storage
 *   --batchSize <number>  Limit the number of reports to process in a single run (default: 0 = no limit)
 */

const {
	readS3Object,
	listS3Folders,
	removeS3Folder,
	listS3Objects,
	getJSONFromS3,
} = require( './utils' );
const { s3Params, s3client } = require( './s3-client' );
const { Octokit } = require( '@octokit/rest' );
const { PutObjectCommand, DeleteObjectCommand } = require( '@aws-sdk/client-s3' );
const config = require( '../src/config.json' );
const moment = require( 'moment' );
const octokit = new Octokit();

// Parse command line arguments
const args = process.argv.slice( 2 );
const argsLower = args.map( arg => arg.toLowerCase() );
const skipGitHubStatus = argsLower.includes( '--skipgithubstatus' );
const jsonOnly = argsLower.includes( '--jsononly' );
const storageOnly = argsLower.includes( '--storageonly' );
const reportIndex = argsLower.indexOf( '--report' );
const reportName = reportIndex !== -1 && args[ reportIndex + 1 ] ? args[ reportIndex + 1 ] : null;
const batchSizeIndex = argsLower.indexOf( '--batchsize' );
const batchSize =
	batchSizeIndex !== -1 && args[ batchSizeIndex + 1 ]
		? parseInt( args[ batchSizeIndex + 1 ], 10 )
		: 0;

const reportsToDelete = [];
const reportsToClean = [];
let testsToDelete = [];
const reportAgeThresholdInDays = 30;
const errorsAgeThresholdInDays = 7;
const testsAgeThresholdInDays = 30;

const plus = String.fromCodePoint( 0x2795 );
const done = String.fromCodePoint( 0x2714 );
const question = String.fromCodePoint( 0x2753 );
const problem = String.fromCodePoint( 0x2757 );
const clean = String.fromCodePoint( 0x1f9f9 );
const trash = String.fromCodePoint( 0x1f5d1 );

( async () => {
	// Display summary of all flags and arguments
	console.log( '\n=== Cleanup Script Configuration ===' );
	console.log( `Skip GitHub Status: ${ skipGitHubStatus }` );
	console.log( `JSON Only: ${ jsonOnly }` );
	console.log( `Storage Only: ${ storageOnly }` );
	console.log( `Report Name: ${ reportName || 'None (process all reports)' }` );
	console.log( `Batch Size: ${ batchSize === 0 ? 'No limit' : batchSize }` );
	console.log( `Report Age Threshold: ${ reportAgeThresholdInDays } days` );
	console.log( `Tests Age Threshold: ${ testsAgeThresholdInDays } days` );
	console.log( `Errors Age Threshold: ${ errorsAgeThresholdInDays } days` );
	console.log( '====================================\n' );

	// If a --report argument exists, clean up that single report and exit
	if ( reportName ) {
		await cleanReport( reportName );
		return;
	}

	let closed = [];
	let open = [];

	if ( ! skipGitHubStatus ) {
		const closedPRs = await octokit.rest.pulls.list( {
			owner: 'Automattic',
			repo: 'jetpack',
			state: 'closed',
			per_page: 100,
		} );

		const openPRs = await octokit.rest.pulls.list( {
			owner: 'Automattic',
			repo: 'jetpack',
			state: 'open',
			per_page: 100,
		} );

		closed = closedPRs.data.map( pr => pr.number.toString() );
		open = openPRs.data.map( pr => pr.number.toString() );
	}

	// If jsonOnly flag is set, skip checking reports and go directly to cleaning JSON files
	if ( jsonOnly ) {
		console.log( 'Skipping report checking due to --jsonOnly flag' );
	} else {
		console.group( '\n', 'Checking existing reports' );
		let reports = await listS3Folders( 'reports/', '/' );
		reports = reports.map( report => report.replace( 'reports/', '' ).replace( '/', '' ) );

		for ( const report of reports ) {
			// Check batch size limits if batching is enabled (batchSize > 0)
			if (
				batchSize > 0 &&
				( reportsToDelete.length >= batchSize || reportsToClean.length >= batchSize )
			) {
				console.log(
					`${ problem } Batch of ${ batchSize } reports to delete or clean created. Moving on to cleaning`
				);
				console.groupEnd();
				break;
			}
			console.group( '\n', `Checking report ${ report }` );

			// Skip folders that should be ignored
			if ( config.ignore.includes( report ) ) {
				console.log( `${ done } ${ report } is in ignore list, skipping` );

				console.groupEnd();
				continue;
			}

			// Permanent reports should not be removed, only old results should be cleaned
			if ( config.permanent.includes( report ) ) {
				console.log( `${ plus } ${ report } is a permanent report, marking for cleaning` );
				// console.log( `Report ${ report } is permanent, will check for old results` );
				reportsToClean.push( report );

				console.groupEnd();
				continue;
			}

			// Report for a closed PR should be removed
			if ( closed.includes( report ) ) {
				console.log( `${ plus } PR ${ report } is closed, marking report for deletion` );
				reportsToDelete.push( report );

				console.groupEnd();
				continue;
			}

			// Report for an open PR should be checked for age
			if ( open.includes( report ) ) {
				console.log( `PR ${ report } is still open` );
				await checkReportAge( report, reportsToDelete, reportsToClean );

				console.groupEnd();
				continue;
			}

			// If the report is possibly for a PR (name is only numbers), check if it's closed
			if ( report.match( /^\d+$/ ) && ! skipGitHubStatus ) {
				let pull;
				try {
					console.log( `Assuming ${ report } is a report for a pull request, checking PR state` );
					pull = await octokit.rest.pulls.get( {
						owner: 'Automattic',
						repo: 'jetpack',
						pull_number: report,
					} );
				} catch ( e ) {
					console.error( `Checking state for pull request '${ report }' failed: ${ e.message }` );
				}

				if ( pull?.data?.state === 'closed' ) {
					console.log( `${ plus } PR ${ report } closed, marking report for deletion` );
					reportsToDelete.push( report );

					console.groupEnd();
					continue;
				} else {
					console.log(
						`${ report } doesn't seem to be a closed PR, will keep it (state=${ pull?.data?.state })`
					);
				}
			}

			// If we're still here it means the report is not for a closed PR, so we'll check for age
			await checkReportAge( report, reportsToDelete, reportsToClean );
			console.groupEnd();
		}

		console.log(
			`The following reports were marked for deletion: ${ JSON.stringify( reportsToDelete ) }`
		);
		console.groupEnd();
	}

	// Remove reports from S3 storage (only if not jsonOnly mode)
	if ( ! jsonOnly ) {
		console.group( '\nRemoving reports from storage' );
		for ( let i = 0; i < reportsToDelete.length; i++ ) {
			const report = reportsToDelete[ i ];
			printProgress(
				`\t ${ trash }  Removing reports (current report ${ report })`,
				i,
				reportsToDelete.length,
				1
			);
			await removeS3Folder( `reports/${ report }`, true );
		}
		if ( reportsToDelete.length > 0 ) {
			console.log();
		}
		console.groupEnd();
	}

	// Clean-up reports data file (only if not storageOnly mode)
	if ( ! storageOnly ) {
		console.group( '\n', 'Cleaning report.json file' );

		// Getting a new list of stored reports after they were cleaned-up
		const storedReports = await listS3Folders( 'reports/', '/' );
		// Remove the 'reports/' prefix and trailing slash from each report name
		storedReports.forEach( ( report, index ) => {
			storedReports[ index ] = report.replace( 'reports/', '' ).replace( '/', '' );
		} );
		console.log( storedReports );

		const json = JSON.parse( ( await readS3Object( 'data/reports.json' ) ).toString() );
		const initialReportsCount = json.reports.length;

		// Only keep reports that are found in S3 storage
		json.reports = json.reports.filter( report => storedReports.includes( `${ report.name }` ) );

		json.reportsCount = json.reports.length;
		json.lastUpdate = new Date().toISOString();
		console.log( `${ clean } Removed ${ initialReportsCount - json.reports.length } reports` );

		const cmd = new PutObjectCommand( {
			Bucket: s3Params.Bucket,
			Key: 'data/reports.json',
			Body: JSON.stringify( json ),
			ContentType: 'application/json',
		} );
		await s3client.send( cmd );
		console.groupEnd();
	}

	// Clean old results for remaining reports (only if not jsonOnly mode)
	if ( ! jsonOnly ) {
		console.group( '\n', 'Cleaning old results for remaining reports' );
		for ( const report of reportsToClean ) {
			console.group( '\n', `Cleaning report ${ report }` );
			await cleanReport( report );
			console.groupEnd();
		}
		console.groupEnd();
	}

	console.group( '\n', 'Cleaning sources for deleted results' );

	console.group( '\n', 'Cleaning up tests data file' );
	const testsJson = JSON.parse( ( await readS3Object( 'data/tests.json' ) ).toString() );
	cleanOldResults( testsJson, 'tests', testsAgeThresholdInDays );
	cleanTestsSourceProperty( testsJson, 'tests' );
	await s3client.send(
		new PutObjectCommand( {
			Bucket: s3Params.Bucket,
			Key: 'data/tests.json',
			Body: JSON.stringify( testsJson ),
			ContentType: 'application/json',
		} )
	);
	console.groupEnd();

	console.group( '\n', 'Cleaning up errors data file' );
	const errorsJson = JSON.parse( ( await readS3Object( 'data/errors.json' ) ).toString() );
	cleanOldResults( errorsJson, 'errors', errorsAgeThresholdInDays );

	errorsJson.errors = errorsJson.errors.filter( e => {
		// Remove errors without results
		if ( ! e.results || e.results.length === 0 ) {
			console.log( `Removing error with no results: ${ e.trace?.substring( 0, 50 ) }...` );
			return false;
		}
		
		// Remove errors with single result older than 3 days
		if ( e.results.length === 1 ) {
			const resultDate = moment( e.results[0].date );
			const daysSinceResult = moment().diff( resultDate, 'days' );
			if ( daysSinceResult > 3 ) {
				console.log( `Removing error with single result older than 3 days: ${ e.trace?.substring( 0, 50 ) }...` );
				return false;
			}
		}
		
		return true;
	} );

	cleanTestsSourceProperty( errorsJson, 'errors' );

	await s3client.send(
		new PutObjectCommand( {
			Bucket: s3Params.Bucket,
			Key: 'data/errors.json',
			Body: JSON.stringify( errorsJson ),
			ContentType: 'application/json',
		} )
	);
	console.groupEnd();

	console.groupEnd();
} )();

async function checkReportAge( report ) {
	console.log( `${ question } Checking age of ${ report } report` );
	let duration = 0;

	try {
		const metadata = await getJSONFromS3( `reports/${ report }/metadata.json`, true );

		duration = moment
			.duration( moment.utc().diff( moment.utc( metadata.updated_on ) ) )
			.as( 'days' )
			.toFixed( 1 );
	} catch ( e ) {
		console.error( `${ problem } Error checking age of ${ report } report: ${ e.message }` );
		console.log( `${ plus } Cannot determine age, marking for deletion` );
		reportsToDelete.push( report );
		return;
	}

	if ( duration > reportAgeThresholdInDays ) {
		console.log(
			`${ plus } Report is older than ${ reportAgeThresholdInDays } days (${ duration }), marking for deletion`
		);
		reportsToDelete.push( report );
		return;
	}

	// console.log( `PR ${ report } is still open, will check for old results` );
	console.log( `${ plus } Report is ${ duration } days old, marking for cleaning of old results` );
	reportsToClean.push( report );
}

async function cleanReport( report ) {
	const history = await getJSONFromS3( `reports/${ report }/report/history/history.json`, false );

	if ( ! history ) {
		console.warn( `${ problem } There was an error reading history data for report '${ report }'` );
		return;
	}

	let testsToKeep = [];
	const shouldClean = [];

	for ( const [ , value ] of Object.entries( history ) ) {
		const testIds = value.items.map( item => item.uid );
		testsToKeep = testsToKeep.concat( testIds );
		if ( testsToKeep.length >= 20 ) {
			shouldClean.push( true );
		}
	}

	if ( ! shouldClean.some( el => el === true ) ) {
		console.log(
			`${ done } All tests in the report have less than 20 results, cleaning is not necessary`
		);
		return;
	}

	const testFiles = await listS3Objects( `reports/${ report }/report/data/test-cases` );
	const testIds = testFiles.map( testFile =>
		testFile.replace( `reports/${ report }/report/data/test-cases/`, '' ).replace( '.json', '' )
	);

	testsToDelete = testIds.filter( testId => ! testsToKeep.includes( testId ) );
	console.log( `Found ${ testsToDelete.length } tests to delete` );

	let attachmentsToDelete = [];
	for ( let i = 0; i < testsToDelete.length; i++ ) {
		printProgress( '\t\t\tChecking each test file for attachments', i, testsToDelete.length );

		const testInfo = await getJSONFromS3(
			`reports/${ report }/report/data/test-cases/${ testsToDelete[ i ] }.json`,
			true
		);
		if ( testInfo.testStage && testInfo.testStage.attachments ) {
			attachmentsToDelete = attachmentsToDelete.concat(
				testInfo.testStage.attachments.map( attachment => attachment.source )
			);
		}
	}
	if ( testsToDelete.length > 0 ) {
		console.log();
	}

	for ( let i = 0; i < attachmentsToDelete.length; i++ ) {
		printProgress(
			`\t\t\tCleaning attachments (${ attachmentsToDelete.length })`,
			i,
			attachmentsToDelete.length
		);
		const key = `reports/${ report }/report/data/attachments/${ attachmentsToDelete[ i ] }`;
		// console.log( `Removing attachment ${ key }` );
		await s3client.send( new DeleteObjectCommand( { Bucket: s3Params.Bucket, Key: key } ) );
	}
	if ( attachmentsToDelete.length > 0 ) {
		console.log();
	}

	for ( let i = 0; i < testsToDelete.length; i++ ) {
		printProgress(
			`\t\t\tCleaning test files (${ testsToDelete.length })`,
			i,
			testsToDelete.length
		);
		const key = `reports/${ report }/report/data/test-cases/${ testsToDelete[ i ] }.json`;
		// console.log( `Removing test result ${ key }` );
		await s3client.send( new DeleteObjectCommand( { Bucket: s3Params.Bucket, Key: key } ) );
	}
	if ( testsToDelete.length > 0 ) {
		console.log();
	}

	console.log(
		`${ clean } Deleted ${ attachmentsToDelete.length } attachments and ${ testsToDelete.length } test result files`
	);
}

/**
 * Go through all results in given data file and remove the source property for results that where deleted
 *    Expected data file structure {objectKey: [results:[{source: 'source'}]]}
 *
 * @param {Object} json      object to be cleaned
 * @param {string} objectKey
 */
function cleanTestsSourceProperty( json, objectKey ) {
	if ( testsToDelete.length === 0 && reportsToDelete.length === 0 ) {
		return;
	}

	let removed = 0;
	json[ objectKey ]
		.map( t => t.results )
		.flat()
		.forEach( item => {
			if ( item.source ) {
				if ( testsToDelete.includes( item.source.replace( '.json', '' ) ) ) {
					// console.log( `Removing source ${ item.source } for deleted old result` );
					delete item.source;
					removed++;
				}

				if ( reportsToDelete.includes( item.report ) ) {
					// console.log( `Removing source ${ item.source } for deleted report ${ item.report }` );
					delete item.source;
					removed++;
				}
			}
		} );

	console.log( `${ clean } Removed source property for ${ removed } results` );

	json.lastUpdate = new Date().toISOString();
}

function cleanOldResults( jsonData, objectKey, daysThreshold ) {
	console.log( `Removing results older than ${ daysThreshold } days` );
	jsonData[ objectKey ].forEach( entry => {
		entry.results = entry.results.filter(
			result =>
				moment.duration( moment.utc().diff( moment.utc( result.time ) ) ).as( 'days' ) <
				daysThreshold
		);
	} );
	return jsonData;
}

function printProgress( line, i, total, interval = 50 ) {
	const progress = Math.round( ( ( i + 1 ) / total ) * 100 );
	if ( i % interval === 0 || progress === 100 ) {
		process.stdout.write( `${ line }: ${ progress }%\r` );
	}
}
