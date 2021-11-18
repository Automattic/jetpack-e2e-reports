import React from 'react';
import { Badge } from 'react-bootstrap';
import ReactGA from 'react-ga';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { fetchJsonData } from '../utils/fetch';

export default class Tests extends React.Component {
	state = {
		tests: [],
		daily: [],
		isDataFetched: false,
	};

	async componentDidMount() {
		this.setState( {
			tests: await fetchJsonData( './data/tests.json' ),
			daily: await fetchJsonData( './data/daily.json' ),
			isDataFetched: true,
		} );

		ReactGA.pageview( '/tests' );
	}

	getTotalsBadges( test ) {
		const badges = [ 'failed', 'passed', 'skipped', 'total' ].map(
			( label, id ) => {
				const count = test[ label ];

				// hide statuses with no results
				const classHide = count === 0 ? 'hide' : '';

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
							className={ `label label-fill label-status-${ label } ${ classHide }` }
						>
							{ count } { label }
							<Badge className={ `badge-pill stat-pill` }>
								{ rate }
							</Badge>
						</Badge>
					</li>
				);
			}
		);

		return <ul className="list-unstyled">{ badges }</ul>;
	}

	getResultsLine( test ) {
		const badges = test.results.slice( -500 ).map( ( result, id ) => {
			let classHasSource = 'no-source';
			let url;

			if ( result.source ) {
				classHasSource = '';
				url = `${
					result.report
				}/report/#testresult/${ result.source.replace( /.json/, '' ) }`;
			}

			return (
				<Badge
					key={ id }
					onClick={ () => {
						if ( url ) window.open( url, '_blank' );
					} }
					className={ `has-tooltip label label-small label-status-${ result.status } ${ classHasSource }` }
				>
					&nbsp;
					<span className="tooltip-content">
						{ moment( result.time ).format( 'MMM Do, h:mm a' ) }
						<br />
						{ result.source }
					</span>
				</Badge>
			);
		} );
		return <div>{ badges }</div>;
	}

	getTestContent( test, id ) {
		return (
			<div key={ id } className="test-container">
				<div className="row">
					<div className="col-sm-auto">
						<h1>{ test.name }</h1>
					</div>
				</div>
				<div className="row">
					<div className="col-sm-auto">
						{ this.getTotalsBadges( test ) }
					</div>
					<div className="col">{ this.getResultsLine( test ) }</div>
				</div>
			</div>
		);
	}

	render() {
		if ( ! this.state.isDataFetched ) return null;

		// process tests data
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

		let totalTestResults = 0;
		const distinctTests = tests.length;
		let failedResults = 0;
		tests.forEach( ( t ) => {
			totalTestResults += t.total;
			failedResults += t.failed;
		} );
		const failedRate = ( failedResults / totalTestResults ).toFixed( 2 );

		// process daily stats data
		const dailyStats = this.state.daily;
		dailyStats.forEach( ( day ) => {
			day.failedRate = ( day.failed / day.total ).toFixed( 2 );
		} );

		// sort( dailyStats, 'date' );

		const allDates = dailyStats.map( function ( e ) {
			return e.date;
		} );

		// chart options
		const chartOptions = {
			grid: {
				left: 50,
				right: 50,
			},
			dataZoom: [
				{
					type: 'slider',
					startValue: allDates[ allDates.length - 14 ],
					endValue: allDates[ allDates.length - 1 ],
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
				<div className="row text-center">
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">
								{ distinctTests }
							</span>
							<br />
							<span className="stat-description">tests</span>
						</div>
					</div>
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">
								{ totalTestResults }
							</span>
							<br />
							<span className="stat-description">results</span>
						</div>
					</div>
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">
								{ failedResults }
							</span>
							<br />
							<span className="stat-description">failures</span>
						</div>
					</div>
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">{ failedRate }%</span>
							<br />
							<span className="stat-description">
								failure rate
							</span>
						</div>
					</div>
				</div>
				<hr />
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
