import React from 'react';
import ReactGA from 'react-ga';
import ReactEcharts from 'echarts-for-react';
import { fetchJsonData } from '../utils/fetch';
import { sortArray } from '../utils/sort';
import BaseComponent from './BaseComponent';
import config from '../config.json';
import moment from 'moment';

export default class Charts extends BaseComponent {
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
		filters: { isMasterOnly: true },
		isDataReady: false,
	};

	async componentDidMount() {
		this.setState( {
			rawData: {
				dailyData: await fetchJsonData( `${ config.dataSourceURL }/data/results-daily.json` ),
				weeklyData: await fetchJsonData( `${ config.dataSourceURL }/data/results-weekly.json` ),
				monthlyData: await fetchJsonData( `${ config.dataSourceURL }/data/results-monthly.json` ),
				summaryData: await fetchJsonData( `${ config.dataSourceURL }/data/summary.json` ),
			},
		} );

		this.setState( { days: this.filterData( this.state.rawData.dailyData ) } );
		this.setState( { weeks: this.filterData( this.state.rawData.weeklyData ) } );
		this.setState( { months: this.filterData( this.state.rawData.monthlyData ) } );
		this.setState( { summary: this.filterSummaryData() } );

		this.setState( {
			isDataReady: true,
		} );

		ReactGA.pageview( '/charts' );
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.state.filters !== prevState.filters ) {
			this.setState( { days: this.filterData( this.state.rawData.dailyData ) } );
			this.setState( { weeks: this.filterData( this.state.rawData.weeklyData ) } );
			this.setState( { months: this.filterData( this.state.rawData.monthlyData ) } );
			this.setState( { summary: this.filterSummaryData() } );
		}
	}

	filterData( rawData ) {
		// make a copy of raw data object
		// we don't modify the original data
		let entries = JSON.parse( JSON.stringify( rawData ) );

		if ( this.state.filters.isMasterOnly ) {
			entries = entries.map( entry => {
				const newObj = entry.master;
				newObj.date = entry.date;
				return newObj;
			} );
		} else {
			entries = entries.map( entry => {
				const newObj = entry.total;
				newObj.date = entry.date;
				return newObj;
			} );
		}

		entries.forEach( day => {
			day.failedRate = ( ( day.failed / day.total ) * 100 ).toFixed( 2 );
		} );

		sortArray( entries, 'date', false );

		return entries;
	}

	filterSummaryData() {
		// make a copy of raw data object
		// we don't modify the original data
		const summaryData = {};

		if ( this.state.filters.isMasterOnly ) {
			Object.keys( this.state.rawData.summaryData.stats ).forEach( key => {
				summaryData[ key ] = this.state.rawData.summaryData.stats[ key ].master;
			} );
		} else {
			Object.keys( this.state.rawData.summaryData.stats ).forEach( key => {
				summaryData[ key ] = this.state.rawData.summaryData.stats[ key ].total;
			} );
		}

		Object.keys( summaryData ).forEach( key => {
			summaryData[ key ].failureRate = (
				( summaryData[ key ].failed / summaryData[ key ].total ) *
				100
			).toFixed( 2 );
		} );

		return summaryData;
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
		if ( ! this.state.isDataReady ) {
			return null;
		}

		return (
			<div>
				<div className="row">
					<div className="col-sm filters">{ this.getMasterOnlyFilterButton() }</div>
				</div>
				<hr />
				<div className="row">
					<div className="col-sm">
						<span className="inner-title">Failure rate</span>
					</div>
				</div>
				<div className="row text-center">
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">
								{ this.state.summary[ '24h' ].failureRate }
								<small>%</small>
							</span>
							<br />
							<span className="stat-description">24h</span>
						</div>
					</div>
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">
								{ this.state.summary[ '7d' ].failureRate }
								<small>%</small>
							</span>
							<br />
							<span className="stat-description">7d</span>
						</div>
					</div>
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">
								{ this.state.summary[ '14d' ].failureRate }
								<small>%</small>
							</span>
							<br />
							<span className="stat-description">14d</span>
						</div>
					</div>
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">
								{ this.state.summary[ '30d' ].failureRate }
								<small>%</small>
							</span>
							<br />
							<span className="stat-description">30d</span>
						</div>
					</div>
				</div>
				<div className="row justify-content-end">
					<div className="col-sm text-end">
						<small>updated { moment( this.state.rawData.summaryData.lastUpdate ).fromNow() }</small>
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
		);
	}
}
