import React from 'react';
import ReactGA from 'react-ga';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import { Badge, Button } from 'react-bootstrap';
import { fetchJsonData } from '../utils/fetch';
import { sortArray } from '../utils/sort';
import { masterRuns } from '../config.json';

export default class Failures extends React.Component {
	state = {
		rawData: {
			errorsData: {},
			weeklyData: [],
		},
		errors: {
			list: [],
			totalErrors: 0,
			distinctErrors: 0,
		},
		weeks: [],
		isMasterOnly: false,
		sort: { by: 'common', isAsc: false },
		isDataReady: false,
	};

	async componentDidMount() {
		this.setState( {
			rawData: {
				errorsData: await fetchJsonData( './data/errors.json' ),
				weeklyData: await fetchJsonData( './data/weekly.json' ),
			},
		} );

		this.setErrorsData();
		this.setWeeklyStatsData();

		this.setState( {
			isDataReady: true,
		} );

		ReactGA.pageview( '/failures' );
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.state.isMasterOnly !== prevState.isMasterOnly ) {
			this.setErrorsData();
		}

		if ( this.state.sort !== prevState.sort ) {
			this.sortData();
		}
	}

	setErrorsData() {
		// make a copy of raw data errors object to process
		// wwe don't modify the original data
		let errors = JSON.parse(
			JSON.stringify( this.state.rawData.errorsData.errors )
		);

		if ( this.state.isMasterOnly ) {
			errors.forEach( ( e ) => {
				e.results = e.results.filter( ( r ) =>
					masterRuns.includes( r.report )
				);
			} );
		}

		// filter out errors with 0 occurrences
		errors = errors.filter( ( e ) => e.results.length > 0 );

		// calculate some stats for each error
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

		const allErrors = errors.map( ( e ) => e.results ).flat();

		this.setState( {
			errors: {
				list: errors,
				distinctErrors: errors.length,
				totalErrors: allErrors.length,
			},
		} );

		this.sortData();
	}

	sortData() {
		switch ( this.state.sort.by ) {
			case 'recent':
				this.state.errors.list.sort( ( a, b ) =>
					this.state.sort.isAsc
						? a.newest - b.newest
						: b.newest - a.newest
				);
				break;
			case 'common':
				this.state.errors.list.sort( ( a, b ) =>
					this.state.sort.isAsc
						? a.results.length - b.results.length
						: b.results.length - a.results.length
				);
				break;
		}
	}

	setWeeklyStatsData() {
		// make a copy of raw data object
		// we don't modify the original data
		const weeks = JSON.parse(
			JSON.stringify( this.state.rawData.weeklyData )
		);

		weeks.forEach( ( week ) => {
			week.failedRate = ( week.failed / week.total ).toFixed( 2 );
		} );

		sortArray( weeks, 'date' );

		this.setState( { weeks } );
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
		return (
			<div>
				{ results.map( ( result, id ) => {
					let badge = moment( result.time ).format(
						'MMM Do, h:mm a'
					);

					let className = 'no-source';

					if ( result.source ) {
						const url = `${
							result.report
						}/report/#testresult/${ result.source.replace(
							/.json/,
							''
						) }`;
						badge = (
							<a
								href={ url }
								target="_blank"
								rel="noreferrer"
								className="report-link"
							>
								{ badge }
							</a>
						);

						className = '';
					}

					return (
						<span
							key={ id }
							className={ `failure-link ${ className }` }
						>
							{ badge }
						</span>
					);
				} ) }
			</div>
		);
	}

	getErrorContent( error, id ) {
		let details = `${ error.total } times, since ${ moment(
			error.oldest
		).fromNow() }. Last failed ${ moment( error.newest ).fromNow() }`;

		if ( error.total === 1 ) {
			details = `once, ${ moment( error.oldest ).fromNow() }`;
		}

		return (
			<div className="error-container" key={ id }>
				<div className="row">
					<pre className="error-container-trace">{ error.trace }</pre>
					<div>{ details }</div>
				</div>
				<div className="row">
					{ this.getListOfTests( error.tests ) }
				</div>
				<div className="row">
					{ this.getListOfFailures( error.results ) }
				</div>
			</div>
		);
	}

	getSortButtons() {
		const sortOptions = {
			recent: 'most recent',
			common: 'most common',
		};

		const klass = this.state.sort.isAsc ? 'sort-by-asc' : 'sort-by-desc';
		return Object.keys( sortOptions ).map( ( key, index ) => {
			return (
				<Button
					variant="dark"
					key={ index }
					onClick={ () => {
						this.setState( {
							sort: { by: key, isAsc: ! this.state.sort.isAsc },
						} );
					} }
				>
					{ sortOptions[ key ].toUpperCase() }
					{
						<span
							className={
								this.state.sort.by === key ? klass : ''
							}
						/>
					}
				</Button>
			);
		} );
	}

	chartOptions() {
		return {
			grid: {
				left: 50,
				right: 50,
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
					data: this.state.weeks.map( function ( e ) {
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
			series: [
				{
					name: 'failure rate',
					type: 'line',
					yAxisIndex: 1,
					color: '#e38474',
					symbol: 'roundRect',
					symbolSize: 7,
					data: this.state.weeks.map( function ( e ) {
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
					data: this.state.weeks.map( function ( e ) {
						return e.failed;
					} ),
				},
			],
		};
	}

	render() {
		if ( ! this.state.isDataReady ) return null;

		const lastUpdate = moment(
			this.state.rawData.errorsData.lastUpdate
		).fromNow();

		return (
			<div>
				<ReactEcharts option={ this.chartOptions() } />
				<hr />
				<div className="row text-center">
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">
								{ this.state.errors.totalErrors }
							</span>
							<br />
							<span className="stat-description">
								total errors
							</span>
						</div>
					</div>
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">
								{ this.state.errors.distinctErrors }
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
					<div className="col-sm filters">
						<label
							htmlFor="only-master"
							className="checkbox-container"
						>
							only master
							<input
								type="checkbox"
								id={ 'only-master' }
								onChange={ ( e ) =>
									this.setState( {
										isMasterOnly: e.target.checked,
									} )
								}
							/>
							<span className="checkmark" />
						</label>
					</div>
					<div className="col-md sort-buttons">
						{ this.getSortButtons() }
					</div>
				</div>
				<hr />
				<div>
					{ this.state.errors.list.map( ( error, id ) =>
						this.getErrorContent( error, id )
					) }
				</div>
				<div className="row">
					<div className="text-right col small">
						updated { lastUpdate }
					</div>
				</div>
			</div>
		);
	}
}
