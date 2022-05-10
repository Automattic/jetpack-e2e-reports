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
		},
		days: [],
		weeks: [],
		months: [],
		filters: { isMasterOnly: true },
		isDataReady: false,
	};

	async componentDidMount() {
		this.setState( {
			rawData: {
				dailyData: await fetchJsonData( `${ config.dataSourceURL }/data/results-daily.json` ),
				weeklyData: await fetchJsonData( `${ config.dataSourceURL }/data/results-weekly.json` ),
				monthlyData: await fetchJsonData( `${ config.dataSourceURL }/data/results-monthly.json` ),
			},
		} );

		this.setState( { days: this.filterData( this.state.rawData.dailyData ) } );
		this.setState( { weeks: this.filterData( this.state.rawData.weeklyData ) } );
		this.setState( { months: this.filterData( this.state.rawData.monthlyData ) } );

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
		}
	}

	filterData( rawData ) {
		// make a copy of raw data object
		// we don't modify the original data
		let entries = JSON.parse(
			JSON.stringify( rawData )
		);

		if ( this.state.filters.isMasterOnly ) {
			entries = entries.map( ( entry ) => {
				const newObj = entry.master;
				newObj.date = entry.date;
				return newObj;
			} );
		} else {
			entries = entries.map( ( entry ) => {
				const newObj = entry.total;
				newObj.date = entry.date;
				return newObj;
			} );
		}

		entries.forEach( ( day ) => {
			day.failedRate = ( day.failed / day.total * 100 ).toFixed( 2 );
		} );

		sortArray( entries, 'date', false );

		return entries;
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
					data: data.map( function( e ) {
						return e.date;
					} ),
					axisLabel: {
						formatter: '{value}',
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
							type: 'dotted',
							color: '#6b6d76',
						},
					},
				},
				{
					type: 'value',
					splitLine: {
						lineStyle: {
							type: 'dashed',
							color: 'rgba(107,109,118,0.47)',
						},
					},
					min: 0,
					axisLabel: {
						formatter: '{value} %',
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
					data: data.map( function( e ) {
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
					data: data.map( function( e ) {
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
					data: data.map( function( e ) {
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
					data: data.map( function( e ) {
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
		options.xAxis[ 0 ].axisLabel.formatter = ( value ) => {
			return moment( value ).format( 'MMM D, YYYY' );
		};
		options.xAxis[ 0 ].axisPointer.label.formatter = ( params ) => {
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
		options.xAxis[ 0 ].axisLabel.formatter = ( value ) => {
			return moment( value ).format( 'MMM YYYY' );
		};
		options.xAxis[ 0 ].axisPointer.label.formatter = ( params ) => {
			return moment( params.value ).format( 'MMM YYYY' );
		};

		return options;
	}

	dailyHeatMapOptions() {
		const data = this.state.days.map( function( e ) {
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
				formatter: ( params ) => {
					const values = params.value.toString().split( ',' );
					return '<b>' + moment( values[ 0 ] ).format( 'MMM D, YYYY' ) + '</b><br/>' + values[ 1 ] + '%';
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
						'rgba(115, 151, 75, 0.73)',
						'#ffd050',
						'rgba(253, 90, 62, 0.71)',
					],
				},
			},
			calendar: {
				bottom: 10,
				top: 100,
				cellSize: [ 'auto', 15 ],
				range: [ moment().subtract( 1, 'year' ).format( 'YYYY-MM-DD' ), moment().format( 'YYYY-MM-DD' ) ],
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

		return <div>
			<div className="row text-center">
				<div className="col-sm">
					<div className="stat-box">
						<span className="stat-number">
							0.00 %
						</span>
						<br />
						<span className="stat-description">24h failure rate</span>
					</div>
				</div>
				<div className="col-sm">
					<div className="stat-box">
						<span className="stat-number">
							0.00 %
						</span>
						<br />
						<span className="stat-description">7d failure rate</span>
					</div>
				</div>
				<div className="col-sm">
					<div className="stat-box">
						<span className="stat-number">
							0.00 %
						</span>
						<br />
						<span className="stat-description">30d failure rate</span>
					</div>
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
		</div>;
	}
}
