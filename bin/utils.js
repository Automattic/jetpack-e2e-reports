const fs = require( 'fs' );
const path = require( 'path' );
const { s3client, s3Params } = require( './s3-client' );
const {
	GetObjectCommand,
	ListObjectsCommand,
	DeleteObjectCommand,
} = require( '@aws-sdk/client-s3' );

function getReportsDirs() {
	const configModule = require( '../src/config.js' );
	const config = configModule.default || configModule;
	const excluded = config.ignore;
	console.log( `Excluded dirs: ${ excluded }` );

	return fs
		.readdirSync( 'docs', { withFileTypes: true } )
		.filter( dirent => dirent.isDirectory() && ! excluded.includes( dirent.name ) )
		.map( dirent => dirent.name );
}

function getFilesFromDir( dirPath, fileExtension = '' ) {
	return fs
		.readdirSync( dirPath, {
			withFileTypes: true,
		} )
		.filter( dirent => dirent.isFile() && dirent.name.endsWith( fileExtension ) )
		.map( dirent => dirent.name );
}

function getTestInfoFromTestCaseFile( reportName, fileName ) {
	const filePath = `./docs/${ reportName }/report/data/test-cases/${ fileName }`;
	return JSON.parse( fs.readFileSync( filePath ).toString() );
}

function writeJson( jsonData, filePath, pretty = false ) {
	fs.writeFileSync( path.resolve( filePath ), JSON.stringify( jsonData, null, pretty ? 2 : 0 ) );
}

function readJson( filePath ) {
	let data;
	try {
		data = JSON.parse( fs.readFileSync( path.resolve( filePath ) ).toString() );
	} catch ( err ) {
		console.error( err );
	}
	return data;
}

function sort( data, sortKey, desc = false ) {
	const sorted = data.sort( ( a, b ) =>
		// eslint-disable-next-line no-nested-ternary
		a[ sortKey ] > b[ sortKey ] ? 1 : b[ sortKey ] > a[ sortKey ] ? -1 : 0
	);

	if ( desc ) {
		return sorted.reverse();
	}

	return sorted;
}

/**
 * Removes the source property of each element in an array of objects of the file corresponding to the source doesn't exist
 * Expected object structure: {report: xx, source: xx}
 *
 * @param {Array} arr
 */
function cleanSources( arr ) {
	arr.forEach( item => {
		if ( item.source ) {
			const sourcePath = `docs/${ item.report }/report/data/test-cases/${ item.source }`;
			if ( ! fs.existsSync( sourcePath ) ) {
				console.log( `${ sourcePath } not found, removing source` );
				delete item.source;
			}
		}
	} );
}

async function readS3Object( key, silent = false ) {
	if ( ! silent ) {
		console.log( `Reading file ${ key } from S3` );
	}

	const cmd = new GetObjectCommand( { Bucket: s3Params.Bucket, Key: key } );
	let content;

	try {
		const data = await s3client.send( cmd );
		content = await streamToString( data.Body );
	} catch ( error ) {
		if ( ! silent ) {
			console.error( error.message );
		}
	}

	return content;
}

async function listS3Objects( prefix, delimiter = '' ) {
	const bucketParams = {
		Bucket: s3Params.Bucket,
		Prefix: prefix,
		Delimiter: delimiter,
	};

	const objects = [];
	let truncated = true;
	let pageMarker;
	let page = 1;

	while ( truncated && page < 10 ) {
		try {
			console.log( `Listing objects with prefix ${ prefix } and marker ${ pageMarker }` );
			const data = await s3client.send( new ListObjectsCommand( bucketParams ) );
			objects.push( ...data.Contents.map( item => item.Key ) );

			truncated = data.IsTruncated;
			if ( truncated ) {
				pageMarker = data.Contents.slice( -1 )[ 0 ].Key;
				bucketParams.Marker = pageMarker;
				page++;
			}
		} catch ( err ) {
			console.log( 'Error', err );
			truncated = false;
		}
	}

	return objects;
}

async function listS3Folders( prefix ) {
	console.log( `Listing folders with prefix ${ prefix }` );
	const cmd = new ListObjectsCommand( { Bucket: s3Params.Bucket, Prefix: prefix, Delimiter: '/' } );
	let objects = [];

	try {
		const data = await s3client.send( cmd );
		objects = data.CommonPrefixes.map( item => item.Prefix );
	} catch ( err ) {
		console.log( 'Error', err );
	}

	return objects;
}

async function removeS3Folder( prefix, quiet = false ) {
	if ( ! quiet ) {
		console.log( `Removing all files with prefix ${ prefix }` );
	}

	try {
		const objectsInFolder = await s3client.send(
			new ListObjectsCommand( { Bucket: s3Params.Bucket, Prefix: prefix } )
		);

		for ( const { Key } of objectsInFolder.Contents ) {
			await s3client.send( new DeleteObjectCommand( { Bucket: s3Params.Bucket, Key } ) );
		}

		if ( objectsInFolder.IsTruncated ) {
			await removeS3Folder( prefix );
		}
	} catch ( err ) {
		console.log( 'Error', err );
	}
}

async function getJSONFromS3( key, silent = false ) {
	try {
		const content = ( await readS3Object( key, silent ) ).toString();
		return JSON.parse( content );
	} catch ( err ) {
		console.error( err );
		return null;
	}
}

const streamToString = stream => {
	return new Promise( ( resolve, reject ) => {
		const chunks = [];
		stream.on( 'data', chunk => chunks.push( chunk ) );
		stream.on( 'error', reject );
		stream.on( 'end', () => resolve( Buffer.concat( chunks ).toString() ) );
	} );
};

function printProgress( progress ) {
	process.stdout.clearLine();
	process.stdout.cursorTo( 0 );
	process.stdout.write( progress );
}

/**
 * Find any folders in a path defined in REPORTS_PATH environment variable path and return their paths
 *
 * @return {*[]} array of paths
 */
function getLocalReportsPaths() {
	const reportsPath = process.env.LOCAL_REPORTS_PATH;

	if ( ! reportsPath ) {
		throw 'LOCAL_REPORTS_PATH env variable is not set';
	}

	if ( ! fs.existsSync( reportsPath ) ) {
		return [];
	}

	return fs
		.readdirSync( reportsPath, { withFileTypes: true } )
		.filter( dirent => {
			if ( ! dirent.isDirectory() ) {
				return false;
			}

			// Validate directory name to prevent path traversal
			// Only allow alphanumeric, hyphens, and underscores
			if ( ! /^[A-Za-z0-9_-]+$/.test( dirent.name ) ) {
				console.warn( `Skipping invalid directory name: ${ dirent.name }` );
				return false;
			}

			return true;
		} )
		.map( dirent => path.join( reportsPath, dirent.name ) );
}

module.exports = {
	getReportsDirs,
	getFilesFromDir,
	getTestInfoFromTestCaseFile,
	writeJson,
	readJson,
	sort,
	cleanSources,
	readS3Object,
	listS3Objects,
	listS3Folders,
	removeS3Folder,
	printProgress,
	getLocalReportsPaths,
	getJSONFromS3,
};
