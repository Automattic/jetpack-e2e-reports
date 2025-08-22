import React from 'react';
import moment from 'moment';
import { fetchJsonData } from '../utils/fetch';
import config from '../config';
import SortButtons from '../components/SortButtons';
import FilterReportDropdown from '../components/FilterReportDropdown';
import FilterDaysSelector from '../components/FilterDaysSelector';
import StatBox from '../components/StatBox';
import TestCard from '../components/TestCard';
import LoadingState from '../components/LoadingState';

export default class TestsView extends React.Component {
	state = {
		rawData: {
			testsData: {},
			summaryData: {},
		},
		tests: {
			list: [],
			distinctTests: 0,
			totalTestResults: 0,
			failedResults: 0,
			failedRate: 0,
		},
		availableReports: [],
		filters: {
			selectedReport: 'total',
			startDate: moment().subtract( 7, 'd' ).format( 'YYYY-MM-DD' ),
			endDate: moment().format( 'YYYY-MM-DD' ),
		},
		sort: { by: 'failedRate', isAsc: false },
		isDataReady: false,
	};

	async componentDidMount() {
		const summaryData = await fetchJsonData( `${ config.dataSourceURL }/data/summary.json` );

		this.setState( {
			rawData: {
				testsData: await fetchJsonData( `${ config.dataSourceURL }/data/tests.json` ),
				summaryData,
			},
		} );

		// Extract available reports from summary data
		const reports = [];
		if ( summaryData.stats && summaryData.stats[ '24h' ] ) {
			Object.keys( summaryData.stats[ '24h' ] ).forEach( key => {
				reports.push( key );
			} );
		}
		this.setState( { availableReports: reports } );

		this.setTestsData();

		this.setState( {
			isDataReady: true,
		} );
	}

	componentDidUpdate( _, prevState ) {
		if ( this.state.filters !== prevState.filters ) {
			console.log( this.state.filters );
			this.setTestsData();
		}

		if ( this.state.tests.list !== prevState.tests.list ) {
			this.sortData( this.state.sort.by, this.state.sort.isAsc );
		}
	}

	setTestsData() {
		// make a copy of raw data object to process
		// we don't modify the original data
		let tests = JSON.parse( JSON.stringify( this.state.rawData.testsData.tests ) );

		if ( this.state.filters.startDate && this.state.filters.endDate ) {
			tests.forEach( t => {
				t.results = t.results.filter( r =>
					moment( r.time ).isBetween(
						moment( this.state.filters.startDate, 'YYYY-MM-DD' ),
						moment( this.state.filters.endDate, 'YYYY-MM-DD' ),
						'd',
						'[]'
					)
				);
			} );
		}

		// Filter by selected report
		if ( this.state.filters.selectedReport === 'trunk' ) {
			// Use config.trunkRuns for trunk filter
			tests.forEach( t => {
				t.results = t.results.filter( r => config.trunkRuns.includes( r.report ) );
			} );
		} else if ( this.state.filters.selectedReport === 'total' ) {
			// For 'total', don't filter - include all reports
		} else {
			// Filter by specific report name
			tests.forEach( t => {
				t.results = t.results.filter( r => r.report === this.state.filters.selectedReport );
			} );
		}

		// filter out tests with 0 results
		tests = tests.filter( e => e.results.length > 0 );

		for ( const test of tests ) {
			test.total = 0;
			for ( const status of [ 'passed', 'failed', 'skipped' ] ) {
				test[ status ] = test.results.filter( t => t.status === status ).length;
				test.total += test[ status ];
			}
			test.failedRate = ( ( test.failed / test.total ) * 100 ).toFixed( 2 );

			test.results.sort( ( a, b ) => {
				return a.time - b.time;
			} );
		}

		let totalTestResults = 0;
		let failedResults = 0;
		tests.forEach( t => {
			totalTestResults += t.total;
			failedResults += t.failed;
		} );
		const failedRate = ( ( failedResults / totalTestResults ) * 100 ).toFixed( 2 );

		this.setState( {
			tests: {
				list: tests,
				distinctTests: tests.length,
				totalTestResults,
				failedResults,
				failedRate,
			},
		} );
	}

	sortData( by, isAsc ) {
		this.state.tests.list.sort( ( a, b ) => ( isAsc ? a[ by ] - b[ by ] : b[ by ] - a[ by ] ) );

		this.setState( {
			sort: { by, isAsc },
		} );
	}


	render() {
		return (
			<LoadingState isLoading={ ! this.state.isDataReady }>
				<div>
					<div className="row align-items-center">
						<div className="col-auto filters">
							<FilterReportDropdown
								availableReports={ this.state.availableReports }
								selectedReport={ this.state.filters.selectedReport }
								onChange={ newValue => {
									this.setState( prevState => ( {
										filters: {
											...prevState.filters,
											selectedReport: newValue,
										},
									} ) );
								} }
							/>
						</div>
						<div className="col-auto filters">
							<FilterDaysSelector
								defaultDays={ 7 }
								min={ 1 }
								max={ 30 }
								step={ 1 }
								onDateChange={ dates => {
									this.setState( prevState => ( {
										filters: {
											...prevState.filters,
											startDate: dates.startDate,
											endDate: dates.endDate,
										},
									} ) );
								} }
							/>
						</div>
					</div>
					<hr />
					<div className="row text-center">
						<div className="col-sm">
							<StatBox value={ this.state.tests.distinctTests } description="tests" />
						</div>
						<div className="col-sm">
							<StatBox value={ this.state.tests.totalTestResults } description="results" />
						</div>
						<div className="col-sm">
							<StatBox value={ this.state.tests.failedResults } description="failures" />
						</div>
						<div className="col-sm">
							<StatBox value={ `${ this.state.tests.failedRate }%` } description="failure rate" />
						</div>
					</div>
					<hr />
					<div className="row">
						<div className="col-md sort-buttons">
							<SortButtons
								sortOptions={ {
									total: 'runs',
									failedRate: 'failure rate',
								} }
								currentSortStateBy={ this.state.sort.by }
								currentSortStateIsAsc={ this.state.sort.isAsc }
								onSort={ this.sortData.bind( this ) }
							/>
						</div>
					</div>
					<hr />
					<div>
						{ this.state.tests.list.map( ( test, id ) => (
							<TestCard key={ id } test={ test } reportDeepUrl={ config.reportDeepUrl } />
						) ) }
					</div>
				</div>
			</LoadingState>
		);
	}
}
