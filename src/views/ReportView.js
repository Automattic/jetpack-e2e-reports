import React, { useState, useEffect } from 'react';
import configData from '../config';
import ReportsTable from '../components/ReportsTable';

export default function Reports() {
	const [ reports, setReports ] = useState( [] );
	const [ pinnedReports, setPinnedReports ] = useState( [] );
	const [ reportsCount, setReportsCount ] = useState( undefined );
	const [ isDataFetched, setIsDataFetched ] = useState( false );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		const fetchReports = async () => {
			try {
				const response = await fetch( `${ configData.dataSourceURL }/data/reports.json`, {
					headers: {
						'Content-Type': 'application/json',
						Accept: 'application/json',
					},
				} );

				if ( ! response.ok ) {
					throw new Error( `Failed to fetch reports: ${ response.status }` );
				}

				const jsonData = await response.json();
				const prReports = [];
				const pinnedReportsData = [];

				for ( const report of jsonData.reports ) {
					if ( configData.permanent.includes( report.name ) ) {
						pinnedReportsData.push( report );
					} else {
						prReports.push( report );
					}
				}

				setReports( prReports );
				setPinnedReports( pinnedReportsData );
				setReportsCount( jsonData.reportsCount );
				setIsDataFetched( true );
			} catch ( err ) {
				console.error( 'Error fetching reports:', err );
				setError( err.message );
			}
		};

		fetchReports();
	}, [] );

	if ( error ) {
		return (
			<div className="alert alert-danger">
				<h4>Error loading reports</h4>
				<p>{ error }</p>
			</div>
		);
	}

	if ( ! isDataFetched ) {
		return null;
	}

	return (
		<article>
			<header className="reports-header">
				<span>{ reportsCount } reports</span>
			</header>
			<section aria-label="Pinned reports">
				<ReportsTable
					reports={ pinnedReports }
					options={ {
						reportCount: false,
						sortButtons: false,
					} }
				/>
			</section>
			<section aria-label="All reports">
				<ReportsTable
					reports={ reports }
					options={ {
						reportCount: false,
						sortButtons: true,
					} }
				/>
			</section>
		</article>
	);
}
