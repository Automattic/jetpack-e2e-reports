import React, { useState, useEffect, useCallback, useMemo } from 'react';
import moment from 'moment';
import { fetchJsonData } from '../utils/fetch';
import { getAvailableReports } from '../utils/reports';
import { calculateMaxDays } from '../utils/date';
import { processTestData } from '../utils/dataProcessing';
import config from '../config';
import SortButtons from '../components/SortButtons';
import FilterReportDropdown from '../components/FilterReportDropdown';
import FilterDaysSelector from '../components/FilterDaysSelector';
import StatBox from '../components/StatBox';
import TestCard from '../components/TestCard';
import LoadingState from '../components/LoadingState';
import UpdatingMessage from '../components/UpdatingMessage';

export default function TestsView() {
	const [ rawData, setRawData ] = useState( {
		testsData: {},
		summaryData: {},
	} );
	const [ tests, setTests ] = useState( {
		list: [],
		distinctTests: 0,
		totalTestResults: 0,
		failedResults: 0,
		failedRate: 0,
	} );
	const [ availableReports, setAvailableReports ] = useState( [] );
	const [ filters, setFilters ] = useState( {
		selectedReport: 'total',
		startDate: null,
		endDate: moment().format( 'YYYY-MM-DD' ),
	} );
	const [ sort, setSort ] = useState( { by: 'failedRate', isAsc: false } );
	const [ isDataReady, setIsDataReady ] = useState( false );
	const [ isProcessing, setIsProcessing ] = useState( false );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		const fetchData = async () => {
			try {
				const [ summaryData, testsData ] = await Promise.all( [
					fetchJsonData( `${ config.dataSourceURL }/data/summary.json` ),
					fetchJsonData( `${ config.dataSourceURL }/data/tests.json` ),
				] );

				// Calculate the default start date based on available data
				const maxDays = calculateMaxDays( testsData.oldestTimestamp ) || 7;
				const defaultDays = Math.min( 7, maxDays );
				const startDate = moment().subtract( defaultDays, 'd' ).format( 'YYYY-MM-DD' );

				// Extract available reports from summary data
				const reports = getAvailableReports( summaryData );

				setRawData( { testsData, summaryData } );
				setFilters( prev => ( { ...prev, startDate } ) );
				setAvailableReports( reports );
				setIsDataReady( true );
			} catch ( err ) {
				console.error( 'Error fetching data:', err );
				setError( err.message );
			}
		};

		fetchData();
	}, [] );

	// Calculate max days based on oldest timestamp
	const getMaxDays = useCallback( () => {
		const oldestTimestamp = rawData.testsData.oldestTimestamp;
		return calculateMaxDays( oldestTimestamp ) || 7;
	}, [ rawData.testsData.oldestTimestamp ] );

	// Process test data when filters change
	const processedTestData = useMemo( () => {
		if ( ! isDataReady || ! rawData.testsData.tests ) {
			return {
				list: [],
				distinctTests: 0,
				totalTestResults: 0,
				failedResults: 0,
				failedRate: 0,
			};
		}

		const processedTests = processTestData( rawData.testsData.tests, filters );

		// Apply default sorting (mimicking original behavior)
		const sortedTests = [ ...processedTests ].sort( ( a, b ) =>
			sort.isAsc ? a[ sort.by ] - b[ sort.by ] : b[ sort.by ] - a[ sort.by ]
		);

		// Calculate aggregate statistics
		const totalTestResults = processedTests.reduce( ( sum, test ) => sum + test.total, 0 );
		const failedResults = processedTests.reduce( ( sum, test ) => sum + test.failed, 0 );
		const failedRate =
			totalTestResults > 0 ? ( ( failedResults / totalTestResults ) * 100 ).toFixed( 2 ) : '0.00';

		return {
			list: sortedTests,
			distinctTests: processedTests.length,
			totalTestResults,
			failedResults,
			failedRate,
		};
	}, [ rawData.testsData.tests, filters, isDataReady, sort.by, sort.isAsc ] );

	// Update tests when processed data changes
	useEffect( () => {
		if ( isDataReady ) {
			setIsProcessing( true );
			setTimeout( () => {
				setTests( processedTestData );
				setIsProcessing( false );
			}, 0 );
		}
	}, [ processedTestData, isDataReady ] );

	// Sort data function
	const sortData = useCallback( ( by, isAsc ) => {
		setTests( prevTests => {
			const sortedList = [ ...prevTests.list ].sort( ( a, b ) =>
				isAsc ? a[ by ] - b[ by ] : b[ by ] - a[ by ]
			);
			return { ...prevTests, list: sortedList };
		} );
		setSort( { by, isAsc } );
	}, [] );

	if ( error ) {
		return (
			<div className="alert alert-danger">
				<h4>Error loading test data</h4>
				<p>{ error }</p>
			</div>
		);
	}

	return (
		<LoadingState isLoading={ ! isDataReady } loadingText="Loading data...">
			<article>
				<section aria-label="Test filters and controls">
					<div className="row align-items-center">
						<div className="col-auto filters">
							<FilterReportDropdown
								availableReports={ availableReports }
								selectedReport={ filters.selectedReport }
								onChange={ newValue => {
									setFilters( prev => ( {
										...prev,
										selectedReport: newValue,
									} ) );
								} }
							/>
						</div>
						<div className="col-lg filters">
							<FilterDaysSelector
								defaultDays={ Math.min( 7, getMaxDays() ) }
								min={ 1 }
								max={ getMaxDays() }
								step={ 1 }
								onDateChange={ dates => {
									setFilters( prev => ( {
										...prev,
										startDate: dates.startDate,
										endDate: dates.endDate,
									} ) );
								} }
							/>
						</div>
						<div className="col-sm filters">
							<UpdatingMessage isUpdating={ isProcessing } updatingText="Updating results..." />
						</div>
					</div>
				</section>
				<hr />
				<section aria-label="Test statistics summary">
					<div className="row text-center">
						<div className="col-sm">
							<StatBox value={ tests.distinctTests } description="tests" />
						</div>
						<div className="col-sm">
							<StatBox value={ tests.totalTestResults } description="results" />
						</div>
						<div className="col-sm">
							<StatBox value={ tests.failedResults } description="failures" />
						</div>
						<div className="col-sm">
							<StatBox value={ `${ tests.failedRate }%` } description="failure rate" />
						</div>
					</div>
				</section>
				<hr />
				<section aria-label="Sort controls">
					<div className="row">
						<div className="col-md sort-buttons">
							<SortButtons
								sortOptions={ {
									total: 'runs',
									failedRate: 'failure rate',
								} }
								currentSortStateBy={ sort.by }
								currentSortStateIsAsc={ sort.isAsc }
								onSort={ sortData }
							/>
						</div>
					</div>
				</section>
				<hr />
				<section aria-label="Test results">
					{ tests.list.map( ( test, id ) => (
						<TestCard key={ id } test={ test } reportDeepUrl={ config.reportDeepUrl } />
					) ) }
				</section>
			</article>
		</LoadingState>
	);
}
