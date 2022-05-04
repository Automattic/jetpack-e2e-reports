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
		filters: { isMasterOnly: false },
		isDataReady: false,
	};

	async componentDidMount() {
		this.setState( {
			rawData: {
				dailyData: await fetchJsonData( `${ config.dataSourceURL }/data/_daily.json` ),
				weeklyData: await fetchJsonData( `${ config.dataSourceURL }/data/_weekly.json` ),
				monthlyData: await fetchJsonData( `${ config.dataSourceURL }/data/_monthly.json` ),
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
		const entries = JSON.parse(
			JSON.stringify( rawData )
		);

		//todo filter by master only

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

	render() {
		if ( ! this.state.isDataReady ) {
			return null;
		}

		return <div>
			<ReactEcharts option={ this.dailyChartOptions() } />
			<hr />
			<ReactEcharts option={ this.weeklyChartOptions() } />
			<hr />
			<ReactEcharts option={ this.monthlyChartOptions() } />
			<hr />
		</div>;
	}
}
