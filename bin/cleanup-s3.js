/**
 * This script will clean old reports and reports for closed PRs
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

const reportsToDelete = [];
const reportsToClean = [];
let testsToDelete = [];
const reportAgeThresholdInDays = 30;

const plus = String.fromCodePoint( 0x2795 );
const done = String.fromCodePoint( 0x2714 );
const remove = String.fromCodePoint( 0x267b );
const question = String.fromCodePoint( 0x2753 );
const problem = String.fromCodePoint( 0x2757 );
const clean = String.fromCodePoint( 0x1F9F9 );

( async () => {
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

	const closed = closedPRs.data.map( pr => pr.number.toString() );
	const open = openPRs.data.map( pr => pr.number.toString() );

	console.group( '\n', 'Checking existing reports' );
	let reports = await listS3Folders( 'reports/', '/' );
	reports = reports.map( report => report.replace( 'reports/', '' ).replace( '/', '' ) );

	for ( const report of reports ) {
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
		if ( report.match( /^\d+$/ ) ) {
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

	// Remove reports from S3 storage
	console.group( '\n', 'Removing reports from storage' );
	for ( const report of reportsToDelete ) {
		console.group( '\n', `${ remove } Removing report ${ report }` );
		await removeS3Folder( `reports/${ report }` );
		console.groupEnd();
	}
	console.groupEnd();

	// Clean-up reports data file
	console.group( '\n', 'Cleaning report.json file' );

	// Getting a new list of stored reports after they were cleaned-up
	let storedReports = await listS3Folders( 'reports/', '/' );
	storedReports = reports.map( report => report.replace( 'reports/', '' ).replace( '/', '' ) );

	const json = JSON.parse( ( await readS3Object( 'data/reports.json' ) ).toString() );
	const initialReportsCount = json.reports.length;

	// Only keep reports that are found in S3 storage
	json.reports = json.reports.filter( report => storedReports.includes( report.name ) );
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

	console.group( '\n', 'Cleaning old results for remaining reports' );
	for ( const report of reportsToClean ) {
		console.group( '\n', `Cleaning report ${ report }` );
		await cleanReport( report );
		console.groupEnd();
	}
	console.groupEnd();

	console.group( '\n', 'Cleaning sources for deleted results' );

	console.group( '\n', 'Cleaning up tests data file' );
	const testsJson = JSON.parse( ( await readS3Object( 'data/tests.json' ) ).toString() );
	cleanOldResults( testsJson, 'tests', 60 );
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
	cleanOldResults( errorsJson, 'errors', 180 );
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

	const metadata = await getJSONFromS3( `reports/${ report }/metadata.json`, true );

	const duration = moment
		.duration( moment.utc().diff( moment.utc( metadata.updated_on ) ) )
		.as( 'days' )
		.toFixed( 1 );

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
	const history = await getJSONFromS3( `reports/${ report }/report/history/history.json`, true );

	if ( ! history ) {
		console.warn( `${ problem } There was an error reading history data found for report ${ report }` );
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
		console.log( `${ done } All tests in the report have less than 20 results, cleaning is not necessary` );
		return;
	}

	const testFiles = await listS3Objects( `reports/${ report }/report/data/test-cases` );
	const testIds = testFiles.map( testFile =>
		testFile.replace( `reports/${ report }/report/data/test-cases/`, '' ).replace( '.json', '' )
	);

	testsToDelete = testIds.filter( testId => ! testsToKeep.includes( testId ) );

	let attachmentsToDelete = [];
	for ( const testId of testsToDelete ) {
		const testInfo = JSON.parse(
			(
				await readS3Object( `reports/${ report }/report/data/test-cases/${ testId }.json`, true )
			 ).toString()
		);
		if ( testInfo.testStage && testInfo.testStage.attachments ) {
			attachmentsToDelete = attachmentsToDelete.concat(
				testInfo.testStage.attachments.map( attachment => attachment.source )
			);
		}
	}

	for ( const attachmentSource of attachmentsToDelete ) {
		const key = `reports/${ report }/report/data/attachments/${ attachmentSource }`;
		// console.log( `Removing attachment ${ key }` );
		await s3client.send( new DeleteObjectCommand( { Bucket: s3Params.Bucket, Key: key } ) );
	}

	for ( const testId of testsToDelete ) {
		const key = `reports/${ report }/report/data/test-cases/${ testId }.json`;
		// console.log( `Removing test result ${ key }` );
		await s3client.send( new DeleteObjectCommand( { Bucket: s3Params.Bucket, Key: key } ) );
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
