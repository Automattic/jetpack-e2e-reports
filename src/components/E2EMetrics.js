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

export default class E2EMetrics extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			data: { reports: [] },
			stats: [],
			failedTests: [],
			statsChartData: [],
		};
	}

	parseStats() {
		const result = {};

		this.state.stats.forEach( ( record ) => {
			const dateObj = new Date( record.time.start );
			const date = dateObj.toISOString().split( 'T' )[ 0 ];

			if ( ! result[ date ] ) {
				result[ date ] = Object.assign( {}, record.statistic );
				result[ date ].failed += record.statistic.broken;

				result[ date ].date = date;
			} else {
				result[ date ].failed +=
					record.statistic.failed + record.statistic.broken;
				result[ date ].skipped += record.statistic.skipped;
				result[ date ].passed += record.statistic.passed;
				result[ date ].unknown += record.statistic.unknown;
				result[ date ].total += record.statistic.total;
			}
		} );

		this.setState( { statsChartData: Object.values( result ) } );
	}

	componentDidMount() {
		fetch( './metrics.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		} )
			.then( ( response ) => response.json() )
			.then( ( jsonData ) => {
				this.setState( { stats: jsonData.stats } );
				this.setState( { failedTests: jsonData.failedTests } );
				this.parseStats();
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

	renderSummaryChart() {
		return (
			<div>
				<LineChart
					width={ 1200 }
					height={ 300 }
					data={ this.state.statsChartData }
					margin={ { top: 5, right: 60, bottom: 5, left: 60 } }
				>
					<CartesianGrid stroke="white" />
					<XAxis dataKey="date" stroke="white" />
					<YAxis stroke="white" />
					<Tooltip />
					<Legend />
					<Line
						type="monotone"
						dataKey="passed"
						stroke="#8884d8"
						isAnimationActive={ false }
					/>
					<Line
						type="monotone"
						dataKey="failed"
						stroke="#82ca9d"
						isAnimationActive={ false }
					/>
				</LineChart>
			</div>
		);
	}

	render() {
		return (
			<div>
				{ this.renderStatsSummary() }
				{ this.renderSummaryChart() }
			</div>
		);
	}
}
