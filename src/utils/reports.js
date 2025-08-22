/**
 * Extract available reports from summary data, filtering out reports with total = 0
 *
 * @param {Object} summaryData - The summary data object containing stats
 * @return {Array} Array of report names that have total > 0
 */
export function getAvailableReports( summaryData ) {
	const reports = [];
	if ( summaryData.stats && summaryData.stats[ '24h' ] ) {
		Object.keys( summaryData.stats[ '24h' ] ).forEach( key => {
			const reportData = summaryData.stats[ '24h' ][ key ];
			if ( reportData && reportData.total > 0 ) {
				reports.push( key );
			}
		} );
	}
	return reports;
}
