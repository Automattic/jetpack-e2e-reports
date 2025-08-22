import React, { useState, useEffect, useCallback, useMemo } from 'react';
import moment from 'moment';
import { fetchJsonData } from '../utils/fetch';
import { getAvailableReports } from '../utils/reports';
import { calculateMaxDays } from '../utils/date';
import { processErrorData } from '../utils/dataProcessing';
import config from '../config';
import SortButtons from '../components/SortButtons';
import FilterReportDropdown from '../components/FilterReportDropdown';
import FilterDaysSelector from '../components/FilterDaysSelector';
import StatBox from '../components/StatBox';
import ErrorCard from '../components/ErrorCard';
import LoadingState from '../components/LoadingState';
import UpdatingMessage from '../components/UpdatingMessage';

export default function ErrorsView() {
	const [ rawData, setRawData ] = useState( {
		errorsData: {},
		summaryData: {},
	} );
	const [ errors, setErrors ] = useState( {
		list: [],
		totalErrors: 0,
		distinctErrors: 0,
	} );
	const [ availableReports, setAvailableReports ] = useState( [] );
	const [ filters, setFilters ] = useState( {
		selectedReport: 'trunk',
		startDate: null,
		endDate: moment().format( 'YYYY-MM-DD' ),
	} );
	const [ sort, setSort ] = useState( { by: 'recent', isAsc: false } );
	const [ isDataReady, setIsDataReady ] = useState( false );
	const [ isProcessing, setIsProcessing ] = useState( false );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		const fetchData = async () => {
			try {
				const [ summaryData, errorsData ] = await Promise.all( [
					fetchJsonData( `${ config.dataSourceURL }/data/summary.json` ),
					fetchJsonData( `${ config.dataSourceURL }/data/errors.json` ),
				] );

				// Calculate the default start date based on available data
				const maxDays = calculateMaxDays( errorsData.oldestTimestamp ) || 7;
				const defaultDays = Math.min( 7, maxDays );
				const startDate = moment().subtract( defaultDays, 'd' ).format( 'YYYY-MM-DD' );

				// Extract available reports from summary data
				const reports = getAvailableReports( summaryData );

				setRawData( { errorsData, summaryData } );
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
		const oldestTimestamp = rawData.errorsData.oldestTimestamp;
		return calculateMaxDays( oldestTimestamp ) || 7;
	}, [ rawData.errorsData.oldestTimestamp ] );

	// Process error data when filters change
	const processedErrorData = useMemo( () => {
		if ( ! isDataReady || ! rawData.errorsData.errors ) {
			return {
				list: [],
				totalErrors: 0,
				distinctErrors: 0,
			};
		}

		const processedErrors = processErrorData( rawData.errorsData.errors, filters );

		// Apply default sorting (mimicking original behavior)
		const sortedErrors = [ ...processedErrors ].sort( ( a, b ) => {
			switch ( sort.by ) {
				case 'recent':
					return sort.isAsc ? a.newest - b.newest : b.newest - a.newest;
				case 'common':
					return sort.isAsc
						? a.results.length - b.results.length
						: b.results.length - a.results.length;
				default:
					return 0;
			}
		} );

		// Calculate aggregate statistics
		const totalErrors = processedErrors.reduce( ( sum, errorItem ) => sum + errorItem.total, 0 );

		return {
			list: sortedErrors,
			distinctErrors: processedErrors.length,
			totalErrors,
		};
	}, [ rawData.errorsData.errors, filters, isDataReady, sort.by, sort.isAsc ] );

	// Update errors when processed data changes
	useEffect( () => {
		if ( isDataReady ) {
			setIsProcessing( true );
			setTimeout( () => {
				setErrors( processedErrorData );
				setIsProcessing( false );
			}, 0 );
		}
	}, [ processedErrorData, isDataReady ] );

	const sortData = useCallback( ( by, isAsc ) => {
		setErrors( prevErrors => {
			const sortedList = [ ...prevErrors.list ].sort( ( a, b ) => {
				switch ( by ) {
					case 'recent':
						return isAsc ? a.newest - b.newest : b.newest - a.newest;
					case 'common':
						return isAsc
							? a.results.length - b.results.length
							: b.results.length - a.results.length;
					default:
						return 0;
				}
			} );
			return { ...prevErrors, list: sortedList };
		} );
		setSort( { by, isAsc } );
	}, [] );

	const getListOfTests = useCallback( tests => {
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
	}, [] );

	const getListOfFailures = useCallback( results => {
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
	}, [] );

	const getErrorContent = useCallback(
		( errorItem, id ) => {
			return (
				<ErrorCard
					key={ id }
					error={ errorItem }
					getListOfTests={ getListOfTests }
					getListOfFailures={ getListOfFailures }
				/>
			);
		},
		[ getListOfTests, getListOfFailures ]
	);

	if ( error ) {
		return (
			<div className="alert alert-danger">
				<h4>Error loading error data</h4>
				<p>{ error }</p>
			</div>
		);
	}

	const lastUpdate = isDataReady ? moment( rawData.errorsData.lastUpdate ).fromNow() : '';

	return (
		<LoadingState isLoading={ ! isDataReady }>
			<article>
				<section aria-label="Error filters and controls">
					<div className="row align-items-center">
						<div className="col-auto filters">
							<FilterReportDropdown
								availableReports={ availableReports }
								selectedReport={ filters.selectedReport }
								onChange={ newValue => {
									setFilters( prevState => ( {
										...prevState,
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
								onDateChange={ dates =>
									setFilters( prevState => ( {
										...prevState,
										startDate: dates.startDate,
										endDate: dates.endDate,
									} ) )
								}
							/>
						</div>
						<div className="col-sm filters">
							<UpdatingMessage isUpdating={ isProcessing } updatingText="Updating results..." />
						</div>
					</div>
				</section>
				<hr />
				<section aria-label="Error statistics summary">
					<div className="row text-center">
						<div className="col-sm">
							<StatBox value={ errors.totalErrors } description="total errors" />
						</div>
						<div className="col-sm">
							<StatBox value={ errors.distinctErrors } description="distinct errors" />
						</div>
					</div>
				</section>
				<hr />
				<section aria-label="Sort controls">
					<div className="row">
						<div className="col sort-buttons">
							<SortButtons
								sortOptions={ {
									recent: 'most recent',
									common: 'most common',
								} }
								currentSortStateBy={ sort.by }
								currentSortStateIsAsc={ sort.isAsc }
								onSort={ sortData }
							/>
						</div>
					</div>
				</section>
				<hr />
				<section aria-label="Error details">
					{ errors.list.map( ( errorItem, id ) => getErrorContent( errorItem, id ) ) }
				</section>
				<footer>
					<div className="row">
						<div className="text-right col small">updated { lastUpdate }</div>
					</div>
				</footer>
			</article>
		</LoadingState>
	);
}
