export async function fetchJsonData( url ) {
	const response = await fetch( url );
	if ( ! response.ok ) {
		const errorMessage = `Error fetching data from ${ url }: ${ response.status } ${ response.statusText }`;
		console.error( errorMessage );
		throw new Error( errorMessage );
	}
	return await response.json();
}
