import React from 'react';
import ReactGA from 'react-ga';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import { sort } from '../utils';
import { Badge } from 'react-bootstrap';

export default class Failures extends React.Component {
	state = {
		errorsData: {},
		weeklyData: [],
		isDataFetched: false,
	};

	async componentDidMount() {
		await fetch( './data/errors.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		} )
			.then( ( response ) => response.json() )
			.then( ( jsonData ) => {
				this.setState( {
					errorsData: jsonData,
				} );
			} )
			.catch( console.log );

		await fetch( './data/weekly.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		} )
			.then( ( response ) => response.json() )
			.then( ( jsonData ) => {
				this.setState( {
					weeklyData: jsonData,
				} );
			} )
			.catch( console.log );

		this.setState( {
			isDataFetched: true,
		} );

		ReactGA.pageview( '/failures' );
	}

	getListOfResults( error ) {
		return (
			<div className="test-container-results">
				{ error.results.slice( -10 ).map( ( result ) => {
					return this.getResultBadge( result );
				} ) }
			</div>
		);
	}

	getResultBadge( result ) {
		const reportUrl = `https://automattic.github.io/jetpack-e2e-reports/${ result.report }/report/`;
		const sourceUrl = `${ result.report }/report/#testresult/${ result.source }`;

		return (
			<div className={ 'label label-status-neutral' }>
				<ul className={ 'list-unstyled' }>
					<li>
						<a
							href={ sourceUrl }
							className="report-link"
							target="_blank"
							rel="noreferrer"
						>
							{ result.test }
							<br />
						</a>
					</li>
					<li>
						<small>
							<a
								href={ reportUrl }
								target={ '_blank' }
								className={ 'report-link' }
								rel={ 'noreferrer' }
							>
								{ result.report }
							</a>
						</small>
					</li>
				</ul>
			</div>
		);
	}

	getListOfTests( tests ) {
		return (
			<div>
				{ tests.map( ( test, id ) => {
					return (
						<Badge
							key={ id }
							className="label label-status-skipped"
						>
							{ test.name }{ ' ' }
							<Badge className={ `badge-pill stat-pill` }>
								{ test.times.length }
							</Badge>
						</Badge>
					);
				} ) }
			</div>
		);
	}

	getListOfFailures( results ) {
		sort( results, 'time', true );

		return (
			<div>
				{ results.map( ( result, id ) => {
					let badge = moment( result.time ).format(
						'MMM Do, h:mm a'
					);

					let className = 'no-source';

					if ( result.source ) {
						const url = `${ result.report }/report/#testresult/${ result.source }`;
						badge = (
							<a
								href={ url }
								target="_blank"
								rel="noreferrer"
								className="badge-link"
							>
								{ badge }
							</a>
						);

						className = '';
					}

					return (
						<Badge
							key={ id }
							className={ `label label-status-failed ${ className }` }
						>
							{ badge }
						</Badge>
					);
				} ) }
			</div>
		);
	}

	getErrorContent( error, id ) {
		let details = `${ error.total } times since ${ moment(
			error.oldest
		).fromNow() }. Last failed ${ moment( error.newest ).fromNow() }`;

		if ( error.total === 1 ) {
			details = `once ${ moment( error.oldest ).fromNow() }`;
		}

		return (
			<div className="error-container" key={ id }>
				<div className="row left">
					<pre className="error-container-trace">{ error.trace }</pre>
				</div>
				<div className="row error-details">{ details }</div>
				<div className="row">
					{ this.getListOfTests( error.tests ) }
				</div>
				<div className="row">
					{ this.getListOfFailures( error.results ) }
				</div>
			</div>
		);
	}

	render() {
		if ( ! this.state.isDataFetched ) return null;

		const errors = this.state.errorsData.errors;

		for ( const error of errors ) {
			error.total = error.results.length;
			const times = error.results.map( ( r ) => r.time );
			error.newest = Math.max( ...times );
			error.oldest = Math.min( ...times );

			const testsNames = [
				...new Set( error.results.map( ( r ) => r.test ) ),
			];

			error.tests = [];

			for ( const testName of testsNames ) {
				const resultsForTest = error.results.filter(
					( r ) => r.test === testName
				);

				error.tests.push( {
					name: testName,
					times: resultsForTest.map( ( r ) => r.time ),
				} );
			}
		}

		errors.sort( ( a, b ) => {
			return b.results.length - a.results.length;
		} );

		const distinctErrors = errors.length;
		const allErrors = errors.map( ( e ) => e.results ).flat();
		const totalErrors = allErrors.length;

		const lastUpdate = moment( this.state.errorsData.lastUpdate ).fromNow();

		const weeklyStats = this.state.weeklyData;

		weeklyStats.forEach( ( week ) => {
			week.failedRate = ( week.failed / week.total ).toFixed( 2 );
		} );

		sort( weeklyStats, 'date' );

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
					data: weeklyStats.map( function ( e ) {
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
							color: '#6b6d76',
						},
					},
					min: 0,
					axisLabel: {
						formatter: '{value} %',
					},
				},
			],
			// dataZoom: [
			// 	{
			// 		type: 'inside',
			// 		start: 0,
			// 		end: 100,
			// 	},
			// 	{
			// 		start: 0,
			// 		end: 100,
			// 	},
			// ],
			series: [
				{
					name: 'failure rate',
					type: 'line',
					yAxisIndex: 1,
					color: '#e38474',
					symbol: 'roundRect',
					symbolSize: 7,
					data: weeklyStats.map( function ( e ) {
						return e.failedRate;
					} ),
				},
				{
					name: 'failed tests',
					type: 'bar',
					emphasis: {
						focus: 'series',
					},
					color: '#fd5a3e',
					data: weeklyStats.map( function ( e ) {
						return e.failed;
					} ),
				},
			],
		};

		return (
			<div>
				<div className="row text-center">
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">{ totalErrors }</span>
							<br />
							<span className="stat-description">
								total errors
							</span>
						</div>
					</div>
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">
								{ distinctErrors }
							</span>
							<br />
							<span className="stat-description">
								distinct errors
							</span>
						</div>
					</div>
				</div>
				<hr />
				<div className="row">
					<div className="text-right col small">
						updated { lastUpdate }
					</div>
				</div>
				<hr />
				<ReactEcharts option={ chartOptions } />
				<hr />
				<div>
					{ errors.map( ( error, id ) =>
						this.getErrorContent( error, id )
					) }
				</div>
			</div>
		);
	}
}
