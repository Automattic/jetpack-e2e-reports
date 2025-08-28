import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactEcharts from 'echarts-for-react';
import { fetchJsonData } from '../utils/fetch';
import { getAvailableReports } from '../utils/reports';
import FilterReportDropdown from '../components/FilterReportDropdown';
import StatBox from '../components/StatBox';
import LoadingState from '../components/LoadingState';
import UpdatingMessage from '../components/UpdatingMessage';
import config from '../config';
import moment from 'moment';

export default function Stats() {
	const [ rawData, setRawData ] = useState( {
		dailyData: [],
		weeklyData: [],
		monthlyData: [],
		summaryData: {},
	} );
	const [ days, setDays ] = useState( [] );
	const [ weeks, setWeeks ] = useState( [] );
	const [ months, setMonths ] = useState( [] );
	const [ summary, setSummary ] = useState( {} );
	const [ availableReports, setAvailableReports ] = useState( [] );
	const [ selectedReport, setSelectedReport ] = useState( 'total' );
	const [ isDataReady, setIsDataReady ] = useState( false );
	const [ isProcessing, setIsProcessing ] = useState( false );

	useEffect( () => {
		const fetchData = async () => {
			try {
				const summaryData = await fetchJsonData( `${ config.dataSourceURL }/data/summary.json` );

				// Fetch all data concurrently for better performance
				const [ dailyData, weeklyData, monthlyData ] = await Promise.all( [
					fetchJsonData( `${ config.dataSourceURL }/data/results-daily.json` ),
					fetchJsonData( `${ config.dataSourceURL }/data/results-weekly.json` ),
					fetchJsonData( `${ config.dataSourceURL }/data/results-monthly.json` ),
				] );

				const newRawData = { dailyData, weeklyData, monthlyData, summaryData };

				// Extract available reports from summary data
				const reports = getAvailableReports( summaryData );

				setRawData( newRawData );
				setAvailableReports( reports );
				setIsDataReady( true );
			} catch ( error ) {
				console.error( 'Error fetching data:', error );
			}
		};

		fetchData();
	}, [] );

	const filterData = useCallback( ( rawDataInput, selectedReportFilter ) => {
		const reportFilter = selectedReportFilter || 'total';

		// Process entries in a single pass for better performance
		const entries = rawDataInput.map( entry => {
			const reportData = entry[ reportFilter ] || { passed: 0, failed: 0, skipped: 0, total: 0 };
			const total = reportData.total || 0;
			const failed = reportData.failed || 0;

			return {
				date: entry.date,
				passed: reportData.passed || 0,
				failed,
				skipped: reportData.skipped || 0,
				total,
				failedRate: total === 0 ? '0.00' : ( ( failed / total ) * 100 ).toFixed( 2 ),
			};
		} );

		// Sort in ascending order (oldest to newest) to match original behavior using string comparison
		entries.sort( ( a, b ) => {
			if ( a.date > b.date ) return 1;
			if ( b.date > a.date ) return -1;
			return 0;
		} );

		return entries;
	}, [] );

	const filterSummaryData = useCallback(
		( rawSummaryData, selectedReportFilter ) => {
			// Use passed parameter to avoid accessing state during mount
			const summaryDataSource = rawSummaryData || rawData.summaryData;
			const reportFilter = selectedReportFilter || 'total';

			// Safety check to ensure data exists
			if ( ! summaryDataSource?.stats ) {
				return {};
			}

			// Process summary data efficiently in a single pass
			const processedSummary = {};

			for ( const [ key, value ] of Object.entries( summaryDataSource.stats ) ) {
				const reportData = value[ reportFilter ] || { passed: 0, failed: 0, skipped: 0, total: 0 };
				const total = reportData.total || 0;
				const failed = reportData.failed || 0;

				processedSummary[ key ] = {
					passed: reportData.passed || 0,
					failed,
					skipped: reportData.skipped || 0,
					total,
					failureRate: total === 0 ? '0.00' : ( ( failed / total ) * 100 ).toFixed( 2 ),
				};
			}

			return processedSummary;
		},
		[ rawData.summaryData ]
	);

	// Update filtered data when selectedReport changes
	useEffect( () => {
		if ( isDataReady ) {
			setIsProcessing( true );

			// Use setTimeout to allow UI to update
			setTimeout( () => {
				setDays( filterData( rawData.dailyData, selectedReport ) );
				setWeeks( filterData( rawData.weeklyData, selectedReport ) );
				setMonths( filterData( rawData.monthlyData, selectedReport ) );
				setSummary( filterSummaryData( rawData.summaryData, selectedReport ) );
				setIsProcessing( false );
			}, 0 );
		}
	}, [ selectedReport, isDataReady, rawData, filterData, filterSummaryData ] );

	// Initialize filtered data when raw data is loaded
	useEffect( () => {
		if ( isDataReady && rawData.dailyData.length > 0 ) {
			setDays( filterData( rawData.dailyData, selectedReport ) );
			setWeeks( filterData( rawData.weeklyData, selectedReport ) );
			setMonths( filterData( rawData.monthlyData, selectedReport ) );
			setSummary( filterSummaryData( rawData.summaryData, selectedReport ) );
		}
	}, [ isDataReady, rawData, selectedReport, filterData, filterSummaryData ] );

	const chartOptions = useCallback( data => {
		return {
			title: {
				text: '',
				left: 'left',
				top: 'top',
				textStyle: {
					fontSize: 20,
					color: '#ccc',
				},
			},
			grid: {
				left: 50,
				right: 50,
			},
			dataZoom: [
				{
					type: 'slider',
					borderColor: '#343a40',
					fillerColor: 'rgba(244,244,244,0.18)',
				},
			],
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'cross',
				},
			},
			legend: {
				textStyle: {
					color: '#ccc',
				},
				left: 'right',
			},
			xAxis: [
				{
					type: 'category',
					data: data.map( function ( e ) {
						return e.date;
					} ),
					axisLabel: {
						formatter: '{value}',
						color: '#ccc',
					},
					axisPointer: {
						label: {
							formatter: '{value}',
						},
					},
				},
			],
			yAxis: [
				{
					type: 'value',
					splitLine: {
						lineStyle: {
							width: 0,
							type: 'dotted',
							color: '#6b6d76',
						},
					},
				},
				{
					type: 'value',
					splitLine: {
						lineStyle: {
							width: 0.5,
							type: 'dashed',
							color: '#6b6d76',
						},
					},
					min: 0,
					axisLabel: {
						formatter: '{value} %',
						color: '#ccc',
					},
				},
			],
			series: [
				{
					name: 'failure rate',
					type: 'line',
					yAxisIndex: 1,
					color: '#e38474',
					symbol: 'roundRect',
					symbolSize: 4,
					data: data.map( e => e.failedRate ),
				},
				{
					name: 'passed tests',
					type: 'bar',
					stack: '1',
					emphasis: {
						focus: 'series',
					},
					color: 'rgba(115, 151, 75, 0.73)',
					data: data.map( e => e.passed ),
				},
				{
					name: 'failed tests',
					type: 'bar',
					stack: '1',
					emphasis: {
						focus: 'series',
					},
					color: 'rgba(253, 90, 62, 0.71)',
					data: data.map( e => e.failed ),
				},
				{
					name: 'skipped tests',
					type: 'bar',
					stack: '1',
					emphasis: {
						focus: 'series',
					},
					color: 'rgba(170, 170, 170, 0.73)',
					data: data.map( e => e.skipped ),
				},
			],
		};
	}, [] );

	const dailyChartOptions = useMemo( () => {
		const options = chartOptions( days );
		options.title.text = 'Daily';
		options.dataZoom[ 0 ].startValue = moment().subtract( 6, 'weeks' ).format( 'YYYY-MM-DD' );
		options.xAxis[ 0 ].axisLabel.formatter = value => {
			return moment( value ).format( 'MMM D, YYYY' );
		};
		options.xAxis[ 0 ].axisPointer.label.formatter = params => {
			return moment( params.value ).format( 'MMM D, YYYY' );
		};

		return options;
	}, [ days, chartOptions ] );

	const weeklyChartOptions = useMemo( () => {
		const options = chartOptions( weeks );
		options.title.text = 'Weekly';
		return options;
	}, [ weeks, chartOptions ] );

	const monthlyChartOptions = useMemo( () => {
		const options = chartOptions( months );
		options.title.text = 'Monthly';
		options.xAxis[ 0 ].axisLabel.formatter = value => {
			return moment( value ).format( 'MMM YYYY' );
		};
		options.xAxis[ 0 ].axisPointer.label.formatter = params => {
			return moment( params.value ).format( 'MMM YYYY' );
		};

		return options;
	}, [ months, chartOptions ] );

	const dailyHeatMapOptions = useMemo( () => {
		const data = days.map( e => [ e.date, e.failedRate ] );
		return {
			title: {
				text: 'Daily failure rate',
				left: 'left',
				top: 'top',
				textStyle: {
					fontSize: 20,
					color: '#ccc',
				},
			},
			tooltip: {
				formatter: params => {
					const values = params.value.toString().split( ',' );
					return (
						'<b>' + moment( values[ 0 ] ).format( 'MMM D, YYYY' ) + '</b><br/>' + values[ 1 ] + '%'
					);
				},
			},
			visualMap: {
				type: 'continuous',
				min: 0,
				max: 5,
				precision: 1,
				textStyle: {
					color: '#ccc',
				},
				calculable: true,
				orient: 'horizontal',
				left: 'right',
				top: 'top',
				inRange: {
					color: [
						'rgba(115, 151, 75, 0.75)',
						'rgba(148,151,75,0.75)',
						'#ffd050',
						'rgba(250,150,40,0.75)',
						'rgba(240,90,0,0.75)',
						'rgba(200,70,0,0.75)',
						'rgba(160,50,0,0.75)',
						'rgba(120,30,0,0.75)',
						'rgba(90,10,0,0.75)',
					],
				},
			},
			calendar: {
				bottom: 10,
				top: 100,
				left: 50,
				right: 50,
				cellSize: [ 'auto', 15 ],
				range: [
					moment().subtract( 1, 'year' ).format( 'YYYY-MM-DD' ),
					moment().format( 'YYYY-MM-DD' ),
				],
				itemStyle: {
					color: '#343a40',
					borderColor: '#454c54',
					borderWidth: 0.3,
				},
				splitLine: {
					show: true,
					lineStyle: {
						width: 0.3,
					},
				},
				yearLabel: { show: true },
				dayLabel: {
					color: '#ccc',
					firstDay: 1,
					position: 'end',
				},
				monthLabel: {
					color: '#ccc',
				},
			},
			series: {
				type: 'heatmap',
				coordinateSystem: 'calendar',
				data,
			},
		};
	}, [ days ] );

	return (
		<LoadingState isLoading={ ! isDataReady }>
			<article>
				<section aria-label="Statistics filters and controls">
					<div className="row align-items-center">
						<div className="col-auto filters">
							<FilterReportDropdown
								availableReports={ availableReports }
								selectedReport={ selectedReport }
								onChange={ setSelectedReport }
							/>
						</div>
						<div className="col-auto filters">
							<UpdatingMessage isUpdating={ isProcessing } updatingText="Updating charts..." />
						</div>
					</div>
				</section>
				<hr />
				<section aria-label="Failure rate statistics">
					<header>
						<div className="row">
							<div className="col-sm">
								<h2 className="inner-title">Failure rate</h2>
							</div>
						</div>
					</header>
					<div className="row text-center">
						<div className="col-sm">
							<StatBox
								value={
									<>
										{ summary[ '24h' ]?.failureRate || '0.00' }
										<small>%</small>
									</>
								}
								description="24h"
							/>
						</div>
						<div className="col-sm">
							<StatBox
								value={
									<>
										{ summary[ '7d' ]?.failureRate || '0.00' }
										<small>%</small>
									</>
								}
								description="7d"
							/>
						</div>
						<div className="col-sm">
							<StatBox
								value={
									<>
										{ summary[ '14d' ]?.failureRate || '0.00' }
										<small>%</small>
									</>
								}
								description="14d"
							/>
						</div>
						<div className="col-sm">
							<StatBox
								value={
									<>
										{ summary[ '30d' ]?.failureRate || '0.00' }
										<small>%</small>
									</>
								}
								description="30d"
							/>
						</div>
					</div>
					<footer>
						<div className="row justify-content-end">
							<div className="col-sm text-end">
								<small>updated { moment( rawData.summaryData.lastUpdate ).fromNow() }</small>
							</div>
						</div>
					</footer>
				</section>
				<hr />
				<section aria-label="Daily failure rate chart">
					<ReactEcharts option={ dailyChartOptions } />
				</section>
				<hr />
				<section aria-label="Daily failure rate heat map">
					<ReactEcharts option={ dailyHeatMapOptions } />
				</section>
				<hr />
				<section aria-label="Weekly failure rate chart">
					<ReactEcharts option={ weeklyChartOptions } />
				</section>
				<hr />
				<section aria-label="Monthly failure rate chart">
					<ReactEcharts option={ monthlyChartOptions } />
				</section>
				<hr />
			</article>
		</LoadingState>
	);
}
