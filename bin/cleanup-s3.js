/**
 * This script will clean old reports and reports for closed PRs
 */

const { readS3Object, listS3Folders, removeS3Folder, listS3Objects } = require( './utils' );
const { s3Params, s3client } = require( './s3-client' );
const { Octokit } = require( '@octokit/rest' );
const { PutObjectCommand, DeleteObjectCommand } = require( '@aws-sdk/client-s3' );
const config = require( '../src/config.json' );
const moment = require( 'moment' );
const octokit = new Octokit();

const reportsToDelete = [];
let testsToDelete = [];

( async () => {
	const reportsToClean = [];

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
		if ( config.ignore.includes( report ) ) {
			console.log( `${ report } is in ignore list, skipping` );
			continue;
		}

		if ( closed.includes( report ) ) {
			console.log( `PR ${ report } is closed, marking report for deletion` );
			reportsToDelete.push( report );
			continue;
		}

		if ( open.includes( report ) ) {
			const metadata = JSON.parse(
				( await readS3Object( `reports/${ report }/metadata.json`, true ) ).toString()
			);
			const duration = moment
				.duration( moment.utc().diff( moment.utc( metadata.updated_on ) ) )
				.as( 'days' );

			if ( duration > 30 ) {
				console.log(
					`Report ${ report } is older than 30 days (${ duration }), marking for deletion`
				);
				reportsToDelete.push( report );
				continue;
			}

			// console.log( `PR ${ report } is still open, will check for old results` );
			reportsToClean.push( report );
			continue;
		}

		if ( config.permanent.includes( report ) ) {
			// console.log( `Report ${ report } is permanent, will check for old results` );
			reportsToClean.push( report );
			continue;
		}

		// If we're here, we should call GitHub to check if the PR is still open
		let pull;
		try {
			pull = await octokit.rest.pulls.get( {
				owner: 'Automattic',
				repo: 'jetpack',
				pull_number: report,
			} );
		} catch ( e ) {
			console.error( `Checking state for pull request ${ report } failed: ${ e.message }` );
		}

		if ( pull && pull.data.state === 'closed' ) {
			// console.log( `PR ${ report } closed, marked for deletion` );
			reportsToDelete.push( report );
		} else {
			console.log( `I don't know what to do with ${ report }, will keep it` );
		}
	}

	console.log(
		`The following reports were marked for deletion: ${ JSON.stringify( reportsToDelete ) }`
	);
	console.groupEnd();

	if ( reportsToDelete.length > 0 ) {
		// Remove reports from reports data file
		console.group( '\n', 'Cleaning report.json file' );
		const json = JSON.parse( ( await readS3Object( 'data/reports.json' ) ).toString() );
		const initialReportsCount = json.reports.length;

		json.reports = json.reports.filter( report => ! reportsToDelete.includes( report.name ) );
		json.reportsCount = json.reports.length;
		json.lastUpdate = new Date().toISOString();
		console.log( `Removed ${ initialReportsCount - json.reports.length } reports` );

		const cmd = new PutObjectCommand( {
			Bucket: s3Params.Bucket,
			Key: 'data/reports.json',
			Body: JSON.stringify( json ),
			ContentType: 'application/json',
		} );
		await s3client.send( cmd );
		console.groupEnd();

		// Remove reports from S3 storage
		console.group( '\n', 'Removing reports from storage' );
		for ( const report of reportsToDelete ) {
			console.group( '\n', `Removing report ${ report }` );
			await removeS3Folder( `reports/${ report }` );
			console.groupEnd();
		}
		console.groupEnd();
	}

	console.group( '\n', 'Cleaning old results for remaining reports' );
	for ( const report of reportsToClean ) {
		console.group( '\n', `Cleaning report ${ report }` );
		await cleanReport( report );
		console.groupEnd();
	}
	console.groupEnd();

	console.group( '\n', 'Cleaning sources for deleted results' );
	console.group( '\n', 'Cleaning up tests data file' );
	await cleanTestsSourceProperty( 'data/tests.json', 'tests' );
	console.groupEnd();
	console.group( '\n', 'Cleaning up errors data file' );
	await cleanTestsSourceProperty( 'data/errors.json', 'errors' );
	console.groupEnd();
	console.groupEnd();
} )();

async function cleanReport( report ) {
	const historyData = await readS3Object( `reports/${ report }/report/history/history.json`, true );

	if ( ! historyData ) {
		console.warn( `There was an error reading history data found for report ${ report }` );
		return;
	}

	const history = JSON.parse( historyData.toString() );

	let testsToKeep = [];

	for ( const [ key, value ] of Object.entries( history ) ) {
		const testIds = value.items.map( item => item.uid );
		testsToKeep = testsToKeep.concat( testIds );
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
		`Deleted ${ attachmentsToDelete.length } attachments and ${ testsToDelete.length } test result files`
	);
}

/**
 * Go through all results in given data file and remove the source property for results that where deleted
 *	Expected data file structure {objectKey: [results:[{source: 'source'}]]}
 *
 * @param {string}  dataFile s3 key of data file
 * @param  {string} objectKey
 * @return {Promise<void>}
 */
async function cleanTestsSourceProperty( dataFile, objectKey ) {
	if ( testsToDelete.length === 0 && reportsToDelete.length === 0 ) {
		return;
	}

	const json = JSON.parse( ( await readS3Object( dataFile ) ).toString() );

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

	console.log( `Removed source property for ${ removed } results` );

	json.lastUpdate = new Date().toISOString();

	const cmd = new PutObjectCommand( {
		Bucket: s3Params.Bucket,
		Key: dataFile,
		Body: JSON.stringify( json ),
		ContentType: 'application/json',
	} );
	await s3client.send( cmd );
}
