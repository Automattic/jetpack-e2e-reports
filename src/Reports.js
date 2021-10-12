import React from 'react';
import ReactGA from 'react-ga';
import configData from './config.json';
import ReportsTable from './components/ReportsTable';

export default class Reports extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			reports: [],
			pinnedReports: [],
			docsSize: undefined,
			reportsCount: undefined,
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
					reports: prReports.reports,
					pinnedReports: pinnedReports.reports,
					docsSize: jsonData.docsSize,
					reportsCount: jsonData.reportsCount,
				} );
			} )
			.catch( console.log );
		ReactGA.pageview( '/reports' );
	}

	render() {
		return (
			<div>
				<div className={ 'reports-header' }>
					{ this.state.reportsCount } reports
				</div>
				<ReportsTable
					reports={ this.state.pinnedReports }
					options={ {
						reportCount: false,
						sortButtons: false,
					} }
				/>
				<ReportsTable
					reports={ this.state.reports }
					options={ {
						reportCount: false,
						sortButtons: true,
					} }
				/>
				<small className={ 'footnote' }>
					docs size: { this.state.docsSize }
				</small>
			</div>
		);
	}
}
