/**
 * Extract available reports from summary data, filtering out reports with total = 0
 *
 * @param {Object} summaryData - The summary data object containing stats
 * @return {Array} Array of report names that have total > 0
 */
export function getAvailableReports( summaryData ) {
	const reports = [];
	if ( summaryData.stats && summaryData.stats[ '30d' ] ) {
		Object.keys( summaryData.stats[ '30d' ] ).forEach( key => {
			const reportData = summaryData.stats[ '30d' ][ key ];
			if ( reportData && reportData.total > 0 ) {
				reports.push( key );
			}
		} );
	}
	return reports;
}
