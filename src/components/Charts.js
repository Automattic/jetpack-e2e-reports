import React from 'react';
import ReactGA from 'react-ga';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { fetchJsonData } from '../utils/fetch';
import { sortArray } from '../utils/sort';
import BaseComponent from './BaseComponent';

export default class Charts extends BaseComponent {
	state = {
		rawData: {
			dailyData: [],
		},
		days: [],
		filters: { isMasterOnly: false },
		isDataReady: false,
	};

	async componentDidMount() {
		this.setState( {
			rawData: {
				dailyData: await fetchJsonData( 'http://jetpack-e2e-reports.s3-website.eu-central-1.amazonaws.com/data/daily.json' ),
			},
		} );

		this.setDailyStatsData();

		this.setState( {
			isDataReady: true,
		} );

		ReactGA.pageview( '/charts' );
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.state.filters !== prevState.filters ) {
			this.setDailyStatsData();
		}
	}

	sortData( by, isAsc ) {
		this.state.tests.list.sort( ( a, b ) =>
			isAsc ? a[ by ] - b[ by ] : b[ by ] - a[ by ]
		);

		this.setState( {
			sort: { by, isAsc },
		} );
	}

	setDailyStatsData() {
		// make a copy of raw data object
		// we don't modify the original data
		let days = JSON.parse(
			JSON.stringify( this.state.rawData.dailyData )
		);

		if ( this.state.filters.startDate && this.state.filters.endDate ) {
			days = days.filter( ( d ) =>
				moment( d.date ).isBetween( moment( this.state.filters.startDate, 'YYYY-MM-DD' ), moment( this.state.filters.endDate, 'YYYY-MM-DD' ), 'd', '[]' )
			);
		}

		days.forEach( ( day ) => {
			day.failedRate = ( day.failed / day.total * 100 ).toFixed( 2 );
		} );

		sortArray( days, 'date', false );

		this.setState( { days } );
	}

	chartOptions() {
		// chart options
		return {
			grid: {
				left: 50,
				right: 50,
			},
			dataZoom: [
				{
					type: 'slider',
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
					color: '#6b6d76',
				},
			},
			xAxis: [
				{
					type: 'category',
					data: this.state.days.map( function( e ) {
						return e.date;
					} ),
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
					symbolSize: 7,
					data: this.state.days.map( function( e ) {
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
					data: this.state.days.map( function( e ) {
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
					data: this.state.days.map( function( e ) {
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
					data: this.state.days.map( function( e ) {
						return e.skipped;
					} ),
				},
			],
		};
	}

	render() {
		if ( ! this.state.isDataReady ) {
			return null;
		}

		return <div>
			<ReactEcharts option={ this.chartOptions() } />
			<hr />
		</div>;
	}
}
