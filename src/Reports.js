import React from 'react';
import ReactGA from 'react-ga';
import configData from './config.json';
import ReportsTable from './components/ReportsTable';

export default class Reports extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			data: { reports: [], pinnedReports: [], docsSize: undefined },
			sortBy: 'lastUpdate',
			isSortAsc: false,
		};
	}

	componentDidMount() {
		fetch( './summary.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		} )
			.then( ( response ) => response.json() )
			.then( ( jsonData ) => {
				const prReports = { reports: [] };
				const pinnedReports = { reports: [] };

				for ( const report of jsonData.reports ) {
					if ( configData.permanent.includes( report.name ) ) {
						pinnedReports.reports.push( report );
					} else {
						prReports.reports.push( report );
					}
				}

				this.setState( {
					data: {
						reports: prReports.reports,
						pinnedReports: pinnedReports.reports,
						docsSize: jsonData.docsSize,
					},
				} );
			} )
			.catch( console.log );
		ReactGA.pageview( '/reports' );
	}

	render() {
		return (
			<div>
				<ReportsTable
					reports={ this.state.data.pinnedReports }
					options={ {
						reportCount: false,
						sortButtons: false,
					} }
				/>
				<ReportsTable
					reports={ this.state.data.reports }
					options={ {
						reportCount: false,
						sortButtons: true,
					} }
				/>
				<small>docs size: { this.state.data.docsSize }</small>
			</div>
		);
	}
}
