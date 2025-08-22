import React from 'react';
import moment from 'moment';
import { fetchJsonData } from '../utils/fetch';
import { getAvailableReports } from '../utils/reports';
import { calculateMaxDays } from '../utils/date';
import { processTestData, batchStateUpdates } from '../utils/dataProcessing';
import config from '../config';
import SortButtons from '../components/SortButtons';
import FilterReportDropdown from '../components/FilterReportDropdown';
import FilterDaysSelector from '../components/FilterDaysSelector';
import StatBox from '../components/StatBox';
import TestCard from '../components/TestCard';
import LoadingState from '../components/LoadingState';
import UpdatingMessage from '../components/UpdatingMessage';

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
			startDate: null, // Will be set after data loads
			endDate: moment().format( 'YYYY-MM-DD' ),
		},
		sort: { by: 'failedRate', isAsc: false },
		isDataReady: false,
		isProcessing: false,
	};

	async componentDidMount() {
		const summaryData = await fetchJsonData( `${ config.dataSourceURL }/data/summary.json` );
		const testsData = await fetchJsonData( `${ config.dataSourceURL }/data/tests.json` );

		// Calculate the default start date based on available data
		const maxDays = calculateMaxDays( testsData.oldestTimestamp ) || 7;
		const defaultDays = Math.min( 7, maxDays );
		const startDate = moment().subtract( defaultDays, 'd' ).format( 'YYYY-MM-DD' );

		// Extract available reports from summary data
		const reports = getAvailableReports( summaryData );

		// Batch all state updates into a single setState call
		batchStateUpdates( this.setState.bind( this ), {
			rawData: {
				testsData,
				summaryData,
			},
			filters: {
				...this.state.filters,
				startDate,
			},
			availableReports: reports,
			isDataReady: true,
		} );

		this.setTestsData();
	}

	async componentDidUpdate( _, prevState ) {
		if ( this.state.filters !== prevState.filters ) {
			this.setState( { isProcessing: true } );
			await this.setTestsDataAsync();
		}

		if ( this.state.tests.list !== prevState.tests.list ) {
			this.sortData( this.state.sort.by, this.state.sort.isAsc );
		}
	}

	setTestsData() {
		// Use optimized data processing instead of deep cloning
		const processedTests = processTestData(
			this.state.rawData.testsData.tests,
			this.state.filters
		);

		// Calculate aggregate statistics
		const totalTestResults = processedTests.reduce( ( sum, test ) => sum + test.total, 0 );
		const failedResults = processedTests.reduce( ( sum, test ) => sum + test.failed, 0 );
		const failedRate =
			totalTestResults > 0 ? ( ( failedResults / totalTestResults ) * 100 ).toFixed( 2 ) : '0.00';

		batchStateUpdates( this.setState.bind( this ), {
			tests: {
				list: processedTests,
				distinctTests: processedTests.length,
				totalTestResults,
				failedResults,
				failedRate,
			},
		} );
	}

	setTestsDataAsync() {
		return new Promise( resolve => {
			setTimeout( () => {
				this.setTestsData();
				this.setState( { isProcessing: false } );
				resolve();
			}, 0 );
		} );
	}

	getMaxDays() {
		const oldestTimestamp = this.state.rawData.testsData.oldestTimestamp;
		return calculateMaxDays( oldestTimestamp ) || 7;
	}

	sortData( by, isAsc ) {
		this.state.tests.list.sort( ( a, b ) => ( isAsc ? a[ by ] - b[ by ] : b[ by ] - a[ by ] ) );

		this.setState( {
			sort: { by, isAsc },
		} );
	}

	render() {
		return (
			<LoadingState isLoading={ ! this.state.isDataReady } loadingText="Loading data...">
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
