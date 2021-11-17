import React from 'react';
import ReactGA from 'react-ga';

import ReactEcharts from 'echarts-for-react';

export default class Performance extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			rawData: [],
			isDataFetched: false,
		};
	}

	prepareChartData( jsonData ) {
		const result = {};

		const calcPercent = ( base, comp ) => ( comp / base - 1 ) * 100;

		const byDate = {};
		jsonData.forEach( ( record ) => {
			let date = new Date( record.date );
			date = date.toISOString().split( 'T' )[ 0 ];
			if ( ! byDate[ date ] ) {
				byDate[ date ] = [];
			}

			const percentage = Object.keys( record.baseAvg ).reduce(
				( acc, metric ) => {
					acc[ metric ] = calcPercent(
						record.baseAvg[ metric ],
						record.jetpackAvg[ metric ]
					);
					return acc;
				},
				{}
			);

			byDate[ date ].push( percentage );
		} );

		Object.entries( byDate ).forEach( ( [ date, recArry ] ) => {
			const size = recArry.length;
			result[ date ] = { date };

			// looping through all the keys, and calculating average for specific day
			Object.keys( recArry[ 0 ] ).forEach( ( metric ) => {
				// sum
				result[ date ][ metric ] = recArry.reduce(
					( a, rec ) => a + rec[ metric ],
					0
				);
				// calculating average
				result[ date ][ metric ] /= size;
				// rounding
				result[ date ][ metric ] =
					Math.round( result[ date ][ metric ] * 100 ) / 100;
			} );
		} );

		return Object.values( result );
	}

	async componentDidMount() {
		await fetch( './data/perf-metrics.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		} )
			.then( ( response ) => response.json() )
			.then( ( jsonData ) => {
				this.setState( {
					rawData: jsonData,
					isDataFetched: true,
				} );
			} )
			.catch( console.log );

		ReactGA.pageview( 'performance' );
	}

	render() {
		if ( ! this.state.isDataFetched ) return null;

		const chartData = this.prepareChartData( this.state.rawData );

		const chartOptions = {
			grid: {
				left: 40,
				right: 0,
			},
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
					data: chartData.map( function ( e ) {
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
			dataZoom: [
				{
					type: 'inside',
					start: 70,
					end: 100,
				},
				{
					start: 70,
					end: 100,
				},
			],
			series: [
				{
					name: 'loaded',
					type: 'bar',
					emphasis: {
						focus: 'series',
					},
					color: 'rgba(115, 151, 75, 0.73)',
					data: chartData.map( function ( e ) {
						return e.loaded;
					} ),
				},
				{
					name: 'firstContentfulPaint',
					type: 'bar',
					emphasis: {
						focus: 'series',
					},
					color: 'rgba(0,123,255,0.73)',
					data: chartData.map( function ( e ) {
						return e.firstContentfulPaint;
					} ),
				},
				{
					name: 'type',
					type: 'bar',
					emphasis: {
						focus: 'series',
					},
					color: 'rgba(253,90,62,0.71)',
					data: chartData.map( function ( e ) {
						return e.type;
					} ),
				},
				{
					name: 'focus',
					type: 'bar',
					emphasis: {
						focus: 'series',
					},
					color: 'rgb(107,109,118)',
					data: chartData.map( function ( e ) {
						return e.focus;
					} ),
				},
				{
					name: 'inserterOpen',
					type: 'bar',
					emphasis: {
						focus: 'series',
					},
					color: 'rgb(160,248,228)',
					data: chartData.map( function ( e ) {
						return e.inserterOpen;
					} ),
				},
			],
		};

		return (
			<div>
				<h4>Performance metrics</h4>
				<ReactEcharts option={ chartOptions } />
			</div>
		);
	}
}
