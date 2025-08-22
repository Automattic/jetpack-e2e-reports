import React from 'react';
import ReactEcharts from 'echarts-for-react';
import { fetchJsonData } from '../utils/fetch';
import { getAvailableReports } from '../utils/reports';
import { batchStateUpdates } from '../utils/dataProcessing';
import FilterReportDropdown from '../components/FilterReportDropdown';
import StatBox from '../components/StatBox';
import LoadingState from '../components/LoadingState';
import UpdatingMessage from '../components/UpdatingMessage';
import config from '../config';
import moment from 'moment';

export default class Stats extends React.Component {
	state = {
		rawData: {
			dailyData: [],
			weeklyData: [],
			monthlyData: [],
			summaryData: {},
		},
		days: [],
		weeks: [],
		months: [],
		summary: {},
		availableReports: [],
		filters: { selectedReport: 'trunk' },
		isDataReady: false,
		isProcessing: false,
	};

	async componentDidMount() {
		const summaryData = await fetchJsonData( `${ config.dataSourceURL }/data/summary.json` );

		// Fetch all data concurrently for better performance
		const [ dailyData, weeklyData, monthlyData ] = await Promise.all( [
			fetchJsonData( `${ config.dataSourceURL }/data/results-daily.json` ),
			fetchJsonData( `${ config.dataSourceURL }/data/results-weekly.json` ),
			fetchJsonData( `${ config.dataSourceURL }/data/results-monthly.json` ),
		] );

		const rawData = { dailyData, weeklyData, monthlyData, summaryData };

		// Extract available reports from summary data
		const reports = getAvailableReports( summaryData );

		// Batch all state updates to reduce re-renders
		batchStateUpdates( this.setState.bind( this ), {
			rawData,
			availableReports: reports,
			days: this.filterData( rawData.dailyData ),
			weeks: this.filterData( rawData.weeklyData ),
			months: this.filterData( rawData.monthlyData ),
			summary: this.filterSummaryData( rawData.summaryData ),
			isDataReady: true,
		} );
	}

	async componentDidUpdate( prevProps, prevState ) {
		if ( this.state.filters !== prevState.filters ) {
			this.setState( { isProcessing: true } );
			await this.updateDataAsync();
		}
	}

	filterData( rawData ) {
		// Use efficient data processing instead of deep cloning
		const selectedReport = this.state.filters.selectedReport || 'trunk';

		// Process entries in a single pass for better performance
		const entries = rawData.map( entry => {
			const reportData = entry[ selectedReport ] || { passed: 0, failed: 0, skipped: 0, total: 0 };
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
	}

	filterSummaryData( rawSummaryData ) {
		// Use passed parameter to avoid accessing state during mount
		const summaryDataSource = rawSummaryData || this.state.rawData.summaryData;
		const selectedReport = this.state.filters.selectedReport || 'trunk';

		// Safety check to ensure data exists
		if ( ! summaryDataSource?.stats ) {
			return {};
		}

		// Process summary data efficiently in a single pass
		const processedSummary = {};

		for ( const [ key, value ] of Object.entries( summaryDataSource.stats ) ) {
			const reportData = value[ selectedReport ] || { passed: 0, failed: 0, skipped: 0, total: 0 };
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
	}

	updateDataAsync() {
		return new Promise( resolve => {
			setTimeout( () => {
				// Batch all updates to reduce re-renders
				batchStateUpdates( this.setState.bind( this ), {
					days: this.filterData( this.state.rawData.dailyData ),
					weeks: this.filterData( this.state.rawData.weeklyData ),
					months: this.filterData( this.state.rawData.monthlyData ),
					summary: this.filterSummaryData(),
					isProcessing: false,
				} );
				resolve();
			}, 0 );
		} );
	}

	chartOptions( data ) {
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
					data: data.map( function ( e ) {
						return e.failedRate;
					} ),
				},
				{
					name: 'passed tests',
					type: 'bar',
					stack: '1',
					emphasis: {
						focus: 'series',
					},
					color: 'rgba(115, 151, 75, 0.73)',
					data: data.map( function ( e ) {
						return e.passed;
					} ),
				},
				{
					name: 'failed tests',
					type: 'bar',
					stack: '1',
					emphasis: {
						focus: 'series',
					},
					color: 'rgba(253, 90, 62, 0.71)',
					data: data.map( function ( e ) {
						return e.failed;
					} ),
				},
				{
					name: 'skipped tests',
					type: 'bar',
					stack: '1',
					emphasis: {
						focus: 'series',
					},
					color: 'rgba(170, 170, 170, 0.73)',
					data: data.map( function ( e ) {
						return e.skipped;
					} ),
				},
			],
		};
	}

	dailyChartOptions() {
		const options = this.chartOptions( this.state.days );
		options.title.text = 'Daily';
		options.dataZoom[ 0 ].startValue = moment().subtract( 6, 'weeks' ).format( 'YYYY-MM-DD' );
		options.xAxis[ 0 ].axisLabel.formatter = value => {
			return moment( value ).format( 'MMM D, YYYY' );
		};
		options.xAxis[ 0 ].axisPointer.label.formatter = params => {
			return moment( params.value ).format( 'MMM D, YYYY' );
		};

		return options;
	}

	weeklyChartOptions() {
		const options = this.chartOptions( this.state.weeks );
		options.title.text = 'Weekly';
		return options;
	}

	monthlyChartOptions() {
		const options = this.chartOptions( this.state.months );
		options.title.text = 'Monthly';
		options.xAxis[ 0 ].axisLabel.formatter = value => {
			return moment( value ).format( 'MMM YYYY' );
		};
		options.xAxis[ 0 ].axisPointer.label.formatter = params => {
			return moment( params.value ).format( 'MMM YYYY' );
		};

		return options;
	}

	dailyHeatMapOptions() {
		const data = this.state.days.map( function ( e ) {
			return [ e.date, e.failedRate ];
		} );
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
							<UpdatingMessage
								isUpdating={ this.state.isProcessing }
								updatingText="Updating charts..."
							/>
						</div>
					</div>
					<hr />
					<div className="row">
						<div className="col-sm">
							<span className="inner-title">Failure rate</span>
						</div>
					</div>
					<div className="row text-center">
						<div className="col-sm">
							<StatBox
								value={
									<>
										{ this.state.summary[ '24h' ]?.failureRate || '0.00' }
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
										{ this.state.summary[ '7d' ]?.failureRate || '0.00' }
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
										{ this.state.summary[ '14d' ]?.failureRate || '0.00' }
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
										{ this.state.summary[ '30d' ]?.failureRate || '0.00' }
										<small>%</small>
									</>
								}
								description="30d"
							/>
						</div>
					</div>
					<div className="row justify-content-end">
						<div className="col-sm text-end">
							<small>
								updated { moment( this.state.rawData.summaryData.lastUpdate ).fromNow() }
							</small>
						</div>
					</div>
					<hr />
					<ReactEcharts option={ this.dailyChartOptions() } />
					<hr />
					<ReactEcharts option={ this.dailyHeatMapOptions() } />
					<hr />
					<ReactEcharts option={ this.weeklyChartOptions() } />
					<hr />
					<ReactEcharts option={ this.monthlyChartOptions() } />
					<hr />
				</div>
			</LoadingState>
		);
	}
}
