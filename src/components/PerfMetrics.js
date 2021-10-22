import React from 'react';
import ReactGA from 'react-ga';

import {
	LineChart,
	Line,
	Tooltip,
	CartesianGrid,
	XAxis,
	YAxis,
	Legend,
} from 'recharts';

export default class PerfMetrics extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			rawData: [],
		};
	}

	prepareChartData() {
		const result = {};

		const calcPercent = ( base, comp ) => ( comp / base - 1 ) * 100;

		const byDate = {};
		this.state.rawData.forEach( ( record ) => {
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

		console.log( JSON.stringify( result ) );
		this.setState( { chartData: Object.values( result ) } );
	}

	componentDidMount() {
		fetch( './perf-metrics.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		} )
			.then( ( response ) => response.json() )
			.then( ( jsonData ) => {
				this.setState( { rawData: jsonData } );
				this.prepareChartData();
			} )
			.catch( console.log );

		ReactGA.pageview( '#metrics' );
	}

	renderStatsSummary() {
		const stats = this.state.stats.reduce(
			( acc, stat ) => {
				acc.failed += stat.statistic.failed + stat.statistic.broken;
				acc.testCases += stat.statistic.total;
				acc.total++;
				return acc;
			},
			{ failed: 0, testCases: 0, total: 0 }
		);
		console.log( JSON.stringify( stats ) );

		const failureRate = ( stats.failed / stats.testCases ) * 100;
		return (
			<div>
				<p>
					Failures: { failureRate }% Test case runs:{ ' ' }
					{ stats.testCases } Total runs: { stats.total }
				</p>
			</div>
		);
	}

	renderFailedTests() {
		const failedTests = this.state.failedTests;
		return failedTests.map( ( test, id ) => (
			<div key={ id }>
				{ test.fileName } { test.name } { test.error.statusMessage }{ ' ' }
				{ test.error.statusTrace.substring( 20 ) }
			</div>
		) );
	}

	// const {
	// 	serverResponse,
	// 	firstPaint,
	// 	domContentLoaded,
	// 	loaded,
	// 	firstContentfulPaint,
	// 	firstBlock,
	// 	type,
	// 	focus,
	// 	inserterOpen,
	// 	inserterHover,
	// 	inserterSearch,
	// } = JSON.parse( results );
	renderChart() {
		return (
			<div>
				<LineChart
					width={ 1200 }
					height={ 300 }
					data={ this.state.chartData }
					margin={ { top: 5, right: 60, bottom: 5, left: 60 } }
				>
					<CartesianGrid stroke="white" />
					<XAxis dataKey="date" stroke="white" />
					<YAxis stroke="white" />
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey="loaded"
						stroke="blue"
						isAnimationActive={ false }
					/>
					<Line
						type="monotone"
						dataKey="firstContentfulPaint"
						stroke="green"
						isAnimationActive={ false }
					/>
					<Line
						type="monotone"
						dataKey="type"
						stroke="red"
						isAnimationActive={ false }
					/>

					<Line
						type="monotone"
						dataKey="focus"
						stroke="grey"
						isAnimationActive={ false }
					/>
					<Line
						type="monotone"
						dataKey="inserterOpen"
						stroke="magenta"
						isAnimationActive={ false }
					/>
				</LineChart>
			</div>
		);
	}

	render() {
		return (
			<div>
				<span>PERF METRICS</span>
				{ this.renderChart() }
			</div>
		);
	}
}
