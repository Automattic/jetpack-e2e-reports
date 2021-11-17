import React from 'react';
import { Badge } from 'react-bootstrap';
import ReactGA from 'react-ga';
import ReactEcharts from 'echarts-for-react';
import { sort } from '../utils';

export default class Tests extends React.Component {
	state = {
		tests: [],
		daily: [],
		isDataFetched: false,
	};

	async componentDidMount() {
		await fetch( './data/tests.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		} )
			.then( ( response ) => response.json() )
			.then( ( jsonData ) => {
				this.setState( {
					tests: jsonData,
				} );
			} )
			.catch( console.log );

		await fetch( './data/daily.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		} )
			.then( ( response ) => response.json() )
			.then( ( jsonData ) => {
				this.setState( {
					daily: jsonData,
				} );
			} )
			.catch( console.log );

		this.setState( {
			isDataFetched: true,
		} );

		ReactGA.pageview( '/tests' );
	}

	getTotalsBadges( test ) {
		const badges = [ 'failed', 'passed', 'skipped', 'total' ].map(
			( label, id ) => {
				const count = test[ label ];
				let rate = (
					( count /
						( test.total -
							( label === 'skipped' ? 0 : test.skipped ) ) ) *
					100
				).toFixed( 1 );

				if ( label === 'total' ) {
					rate = '';
				} else {
					rate = isNaN( rate ) ? '' : `${ rate }%`;
				}

				return (
					<li key={ id }>
						<Badge
							key={ id }
							className={ `label label-status-${ label }` }
						>
							{ label }{ ' ' }
							<Badge className={ `badge-pill stat-pill` }>
								{ rate }
							</Badge>
							<Badge className={ `badge-pill stat-pill` }>
								{ count }
							</Badge>
						</Badge>
					</li>
				);
			}
		);

		return <ul className="list-unstyled">{ badges }</ul>;
	}

	getResultsLine( test ) {
		const badges = test.results.slice( -100 ).map( ( result, id ) => {
			let className = 'no-source';

			if ( result.source ) {
				className = '';
			}

			return (
				<Badge
					key={ id }
					className={ `label label-small label-status-${ result.status } ${ className }` }
				>
					&nbsp;
				</Badge>
			);
		} );
		return <div>{ badges }</div>;
	}

	getTestContent( test, id ) {
		return (
			<div key={ id } className="test-container">
				<h1>{ test.name }</h1>
				<div className="row">
					<div className="col-sm-auto left">
						{ this.getTotalsBadges( test ) }
					</div>
					<div className="col left">
						{ this.getResultsLine( test ) }
					</div>
				</div>
			</div>
		);
	}

	render() {
		if ( ! this.state.isDataFetched ) return null;

		const tests = this.state.tests.tests;

		for ( const test of tests ) {
			test.total = 0;
			for ( const status of [ 'passed', 'failed', 'skipped' ] ) {
				test[ status ] = test.results.filter(
					( t ) => t.status === status
				).length;
				test.total += test[ status ];
			}

			test.results.sort( ( a, b ) => {
				return a.time - b.time;
			} );
		}

		const dailyStats = this.state.daily;
		dailyStats.forEach( ( day ) => {
			day.failedRate = ( day.failed / day.total ).toFixed( 2 );
		} );

		sort( dailyStats, 'date' );

		const chartOptions = {
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
					data: dailyStats.map( function ( e ) {
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
					name: 'failure rate',
					type: 'line',
					yAxisIndex: 1,
					color: '#e38474',
					symbol: 'roundRect',
					symbolSize: 7,
					data: dailyStats.map( function ( e ) {
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
					data: dailyStats.map( function ( e ) {
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
					data: dailyStats.map( function ( e ) {
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
					data: dailyStats.map( function ( e ) {
						return e.skipped;
					} ),
				},
			],
		};

		return (
			<div>
				<ReactEcharts option={ chartOptions } />
				<hr />
				<div>
					{ tests.map( ( test, id ) =>
						this.getTestContent( test, id )
					) }
				</div>
			</div>
		);
	}
}
