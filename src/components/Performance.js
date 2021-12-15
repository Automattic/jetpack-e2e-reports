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
		if ( ! this.state.isDataFetched ) {
			return null;
		}

		const chartData = this.prepareChartData( this.state.rawData );

		const chartOptions = [];

		Object.keys( chartData[ 0 ] ).forEach( key => {
			if ( key !== 'date' ) {
				chartOptions.push( {
					grid: {
						left: 60,
						right: 0,
					},
					title: {
						text: key.replace( /([a-z0-9])([A-Z])/g, '$1 $2' ).toUpperCase(),
						textStyle: {
							color: '#cccccc',
							fontSize: '0.9rem',
						},
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: {
							type: 'cross',
						},
					},
					// legend: {
					// 	textStyle: {
					// 		color: '#f5f5f5',
					// 	},
					// },
					xAxis: [
						{
							type: 'category',
							data: chartData.map( function( e ) {
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
						},
						{
							start: 50,
							end: 100,
						},
					],
					series: [
						{
							name: key,
							type: 'bar',
							emphasis: {
								focus: 'series',
							},
							color: 'rgba(229,232,229,0.73)',
							data: chartData.map( function( e ) {
								return e[ key ];
							} ),
						},
					],
				} );
			}
		} );

		return (
			<div>
				<h4>Performance metrics</h4>
				{ chartOptions.map( ( option, key ) =>
					<div key={ key }>
						<ReactEcharts option={ option } />
						<hr />
					</div>
				) }

			</div>
		);
	}
}
