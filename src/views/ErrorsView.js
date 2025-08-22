import React from 'react';
import moment from 'moment';
import { fetchJsonData } from '../utils/fetch';
import { getAvailableReports } from '../utils/reports';
import config from '../config';
import SortButtons from '../components/SortButtons';
import FilterReportDropdown from '../components/FilterReportDropdown';
import FilterDaysSelector from '../components/FilterDaysSelector';
import StatBox from '../components/StatBox';
import ErrorCard from '../components/ErrorCard';
import LoadingState from '../components/LoadingState';

export default class ErrorsView extends React.Component {
	state = {
		rawData: {
			errorsData: {},
			summaryData: {},
		},
		errors: {
			list: [],
			totalErrors: 0,
			distinctErrors: 0,
		},
		availableReports: [],
		filters: {
			selectedReport: 'trunk',
			startDate: moment().subtract( 7, 'd' ).format( 'YYYY-MM-DD' ),
			endDate: moment().format( 'YYYY-MM-DD' ),
		},
		sort: { by: 'recent', isAsc: false },
		isDataReady: false,
	};

	async componentDidMount() {
		const summaryData = await fetchJsonData( `${ config.dataSourceURL }/data/summary.json` );

		this.setState( {
			rawData: {
				errorsData: await fetchJsonData( `${ config.dataSourceURL }/data/errors.json` ),
				summaryData,
			},
		} );

		// Extract available reports from summary data
		const reports = getAvailableReports( summaryData );
		this.setState( { availableReports: reports } );

		this.setErrorsData();

		this.setState( {
			isDataReady: true,
		} );
	}

	componentDidUpdate( prevProps, prevState ) {
		if (
			this.state.filters.selectedReport !== prevState.filters.selectedReport ||
			this.state.filters.startDate !== prevState.filters.startDate ||
			this.state.filters.endDate !== prevState.filters.endDate
		) {
			this.setErrorsData();
		}

		if ( this.state.errors.list !== prevState.errors.list ) {
			this.sortData( this.state.sort.by, this.state.sort.isAsc );
		}
	}

	setErrorsData() {
		// make a copy of raw data errors object to process
		// wwe don't modify the original data
		let errors = JSON.parse( JSON.stringify( this.state.rawData.errorsData.errors ) );

		// Filter by selected report
		if ( this.state.filters.selectedReport === 'trunk' ) {
			// Use config.trunkRuns for trunk filter
			errors.forEach( e => {
				e.results = e.results.filter( r => config.trunkRuns.includes( r.report ) );
			} );
		} else if ( this.state.filters.selectedReport === 'total' ) {
			// For 'total', don't filter - include all reports
		} else {
			// Filter by specific report name
			errors.forEach( e => {
				e.results = e.results.filter( r => r.report === this.state.filters.selectedReport );
			} );
		}

		// Filter by date range
		if ( this.state.filters.startDate && this.state.filters.endDate ) {
			errors.forEach( e => {
				e.results = e.results.filter( r =>
					moment( r.time ).isBetween(
						moment( this.state.filters.startDate, 'YYYY-MM-DD' ),
						moment( this.state.filters.endDate, 'YYYY-MM-DD' ),
						'd',
						'[]'
					)
				);
			} );
		}

		// filter out errors with 0 occurrences
		errors = errors.filter( e => e.results.length > 0 );

		// calculate some stats for each error
		for ( const error of errors ) {
			error.total = error.results.length;
			const times = error.results.map( r => r.time );
			error.newest = Math.max( ...times );
			error.oldest = Math.min( ...times );

			const testsNames = [ ...new Set( error.results.map( r => r.test ) ) ];

			error.tests = [];

			for ( const testName of testsNames ) {
				const resultsForTest = error.results.filter( r => r.test === testName );

				error.tests.push( {
					name: testName,
					times: resultsForTest.map( r => r.time ),
				} );
			}
		}

		const allErrors = errors.map( e => e.results ).flat();

		this.setState( {
			errors: {
				list: errors,
				distinctErrors: errors.length,
				totalErrors: allErrors.length,
			},
		} );
	}

	sortData( by, isAsc ) {
		switch ( by ) {
			case 'recent':
				this.state.errors.list.sort( ( a, b ) =>
					isAsc ? a.newest - b.newest : b.newest - a.newest
				);
				break;
			case 'common':
				this.state.errors.list.sort( ( a, b ) =>
					isAsc ? a.results.length - b.results.length : b.results.length - a.results.length
				);
				break;
		}

		this.setState( {
			sort: { by, isAsc },
		} );
	}

	getListOfTests( tests ) {
		return (
			<ul className="tests-for-error-list">
				{ tests.map( ( test, id ) => {
					return (
						<li key={ id } className="">
							{ test.times.length } x { test.name }
						</li>
					);
				} ) }
			</ul>
		);
	}

	getListOfFailures( results ) {
		return (
			<div>
				{ results
					.sort( ( a, b ) => b.time - a.time )
					.map( ( result, id ) => {
						let badge = moment( result.time ).format( 'MMM Do, h:mm a' );

						let className = 'no-source';

						if ( result.source ) {
							const url = `${ config.reportDeepUrl }/${
								result.report
							}/report/#testresult/${ result.source.replace( /.json/, '' ) }`;
							badge = (
								<a href={ url } target="_blank" rel="noreferrer" className="report-link">
									{ badge }
								</a>
							);

							className = '';
						} else {
							// don't display results with no source,
							// because it looks bad for some common errors that have a lot of results
							return '';
						}

						return (
							<span key={ id } className={ `failure-link ${ className }` }>
								{ badge }
							</span>
						);
					} ) }
			</div>
		);
	}

	getErrorContent( error, id ) {
		return (
			<ErrorCard
				key={ id }
				error={ error }
				getListOfTests={ this.getListOfTests.bind( this ) }
				getListOfFailures={ this.getListOfFailures.bind( this ) }
			/>
		);
	}

	render() {
		const lastUpdate = this.state.isDataReady
			? moment( this.state.rawData.errorsData.lastUpdate ).fromNow()
			: '';

		return (
			<LoadingState isLoading={ ! this.state.isDataReady }>
				<div>
					<div className="row">
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
								max={ 10 }
								onDateChange={ dates =>
									this.setState( prevState => ( {
										filters: {
											...prevState.filters,
											startDate: dates.startDate,
											endDate: dates.endDate,
										},
									} ) )
								}
							/>
						</div>
					</div>
					<hr />
					<div className="row text-center">
						<div className="col-sm">
							<StatBox value={ this.state.errors.totalErrors } description="total errors" />
						</div>
						<div className="col-sm">
							<StatBox value={ this.state.errors.distinctErrors } description="distinct errors" />
						</div>
					</div>
					<hr />
					<div className="row">
						<div className="col sort-buttons">
							<SortButtons
								sortOptions={ {
									recent: 'most recent',
									common: 'most common',
								} }
								currentSortStateBy={ this.state.sort.by }
								currentSortStateIsAsc={ this.state.sort.isAsc }
								onSort={ this.sortData.bind( this ) }
							/>
						</div>
					</div>
					<hr />
					<div>
						{ this.state.errors.list.map( ( error, id ) => this.getErrorContent( error, id ) ) }
					</div>
					<div className="row">
						<div className="text-right col small">updated { lastUpdate }</div>
					</div>
				</div>
			</LoadingState>
		);
	}
}
