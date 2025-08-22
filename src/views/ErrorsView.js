import React from 'react';
import moment from 'moment';
import { fetchJsonData } from '../utils/fetch';
import { getAvailableReports } from '../utils/reports';
import { calculateMaxDays } from '../utils/date';
import { processErrorData, batchStateUpdates } from '../utils/dataProcessing';
import config from '../config';
import SortButtons from '../components/SortButtons';
import FilterReportDropdown from '../components/FilterReportDropdown';
import FilterDaysSelector from '../components/FilterDaysSelector';
import StatBox from '../components/StatBox';
import ErrorCard from '../components/ErrorCard';
import LoadingState from '../components/LoadingState';
import UpdatingMessage from '../components/UpdatingMessage';

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
			startDate: null, // Will be set after data loads
			endDate: moment().format( 'YYYY-MM-DD' ),
		},
		sort: { by: 'recent', isAsc: false },
		isDataReady: false,
		isProcessing: false,
	};

	async componentDidMount() {
		const summaryData = await fetchJsonData( `${ config.dataSourceURL }/data/summary.json` );
		const errorsData = await fetchJsonData( `${ config.dataSourceURL }/data/errors.json` );

		// Calculate the default start date based on available data
		const maxDays = calculateMaxDays( errorsData.oldestTimestamp ) || 7;
		const defaultDays = Math.min( 7, maxDays );
		const startDate = moment().subtract( defaultDays, 'd' ).format( 'YYYY-MM-DD' );

		// Extract available reports from summary data
		const reports = getAvailableReports( summaryData );

		// Batch all state updates into a single setState call
		batchStateUpdates( this.setState.bind( this ), {
			rawData: {
				errorsData,
				summaryData,
			},
			filters: {
				...this.state.filters,
				startDate,
			},
			availableReports: reports,
			isDataReady: true,
		} );

		this.setErrorsData();
	}

	async componentDidUpdate( _, prevState ) {
		if (
			this.state.filters.selectedReport !== prevState.filters.selectedReport ||
			this.state.filters.startDate !== prevState.filters.startDate ||
			this.state.filters.endDate !== prevState.filters.endDate
		) {
			this.setState( { isProcessing: true } );
			await this.setErrorsDataAsync();
		}

		if ( this.state.errors.list !== prevState.errors.list ) {
			this.sortData( this.state.sort.by, this.state.sort.isAsc );
		}
	}

	setErrorsData() {
		// Use optimized data processing instead of deep cloning
		const processedErrors = processErrorData(
			this.state.rawData.errorsData.errors,
			this.state.filters
		);

		// Calculate aggregate statistics
		const totalErrors = processedErrors.reduce( ( sum, error ) => sum + error.total, 0 );

		batchStateUpdates( this.setState.bind( this ), {
			errors: {
				list: processedErrors,
				distinctErrors: processedErrors.length,
				totalErrors,
			},
		} );
	}

	setErrorsDataAsync() {
		return new Promise( resolve => {
			setTimeout( () => {
				this.setErrorsData();
				this.setState( { isProcessing: false } );
				resolve();
			}, 0 );
		} );
	}

	getMaxDays() {
		const oldestTimestamp = this.state.rawData.errorsData.oldestTimestamp;
		return calculateMaxDays( oldestTimestamp ) || 7;
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
						<div className="col-lg filters">
							<FilterDaysSelector
								defaultDays={ Math.min( 7, this.getMaxDays() ) }
								min={ 1 }
								max={ this.getMaxDays() }
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
						<div className="col-sm filters">
							<UpdatingMessage
								isUpdating={ this.state.isProcessing }
								updatingText="Updating results..."
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
