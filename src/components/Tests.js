import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import ReactGA from 'react-ga';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import { fetchJsonData } from '../utils/fetch';
import { sortArray } from '../utils/sort';
import { masterRuns } from '../config.json';

export default class Tests extends React.Component {
	state = {
		rawData: {
			testsData: {},
			dailyData: [],
		},
		tests: {
			list: [],
			distinctTests: 0,
			totalTestResults: 0,
			failedResults: 0,
			failedRate: 0,
		},
		days: [],
		isMasterOnly: false,
		sort: { by: 'total', isAsc: false },
		isDataReady: false,
	};

	async componentDidMount() {
		this.setState( {
			rawData: {
				testsData: await fetchJsonData( './data/tests.json' ),
				dailyData: await fetchJsonData( './data/daily.json' ),
			},
		} );

		this.setTestsData();
		this.setDailyStatsData();

		this.setState( {
			isDataReady: true,
		} );

		ReactGA.pageview( '/tests' );
	}

	componentDidUpdate( prevProps, prevState ) {
		if ( this.state.isMasterOnly !== prevState.isMasterOnly ) {
			this.setTestsData();
		}

		if ( this.state.sort !== prevState.sort ) {
			this.sortData();
		}
	}

	setTestsData() {
		// make a copy of raw data object to process
		// wwe don't modify the original data
		let tests = JSON.parse(
			JSON.stringify( this.state.rawData.testsData.tests )
		);

		if ( this.state.isMasterOnly ) {
			tests.forEach( ( e ) => {
				e.results = e.results.filter( ( r ) =>
					masterRuns.includes( r.report )
				);
			} );
		}

		// filter out tests with 0 results
		tests = tests.filter( ( e ) => e.results.length > 0 );

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
		let failedResults = 0;
		tests.forEach( ( t ) => {
			totalTestResults += t.total;
			failedResults += t.failed;
		} );
		const failedRate = ( failedResults / totalTestResults ).toFixed( 2 );

		this.setState( {
			tests: {
				list: tests,
				distinctTests: tests.length,
				totalTestResults,
				failedResults,
				failedRate,
			},
		} );

		this.sortData();
	}

	sortData() {
		switch ( this.state.sort.by ) {
			case 'total':
				this.state.tests.list.sort( ( a, b ) =>
					this.state.sort.isAsc
						? b.total - a.total
						: a.total - b.total
				);
				break;
			case 'failures':
				this.state.tests.list.sort( ( a, b ) =>
					this.state.sort.isAsc
						? b.failed - a.failed
						: a.failed - b.failed
				);
				break;
		}
	}

	setDailyStatsData() {
		// make a copy of raw data object
		// we don't modify the original data
		const days = JSON.parse(
			JSON.stringify( this.state.rawData.dailyData )
		);
		days.forEach( ( day ) => {
			day.failedRate = ( day.failed / day.total ).toFixed( 2 );
		} );

		sortArray( days, 'time', true );

		this.setState( { days } );
	}

	chartOptions() {
		const allDates = this.state.days.map( function ( e ) {
			return e.date;
		} );

		// chart options
		return {
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
					data: this.state.days.map( function ( e ) {
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
					data: this.state.days.map( function ( e ) {
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
					data: this.state.days.map( function ( e ) {
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
					data: this.state.days.map( function ( e ) {
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
					data: this.state.days.map( function ( e ) {
						return e.skipped;
					} ),
				},
			],
		};
	}

	getSortButtons() {
		const sortOptions = {
			total: 'most runs',
			failures: 'most failures',
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
		if ( ! this.state.isDataReady ) return null;

		return (
			<div>
				<ReactEcharts option={ this.chartOptions() } />
				<hr />
				<div className="row text-center">
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">
								{ this.state.tests.distinctTests }
							</span>
							<br />
							<span className="stat-description">tests</span>
						</div>
					</div>
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">
								{ this.state.tests.totalTestResults }
							</span>
							<br />
							<span className="stat-description">results</span>
						</div>
					</div>
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">
								{ this.state.tests.failedResults }
							</span>
							<br />
							<span className="stat-description">failures</span>
						</div>
					</div>
					<div className="col-sm">
						<div className="stat-box">
							<span className="stat-number">
								{ this.state.tests.failedRate }%
							</span>
							<br />
							<span className="stat-description">
								failure rate
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
					{ this.state.tests.list.map( ( test, id ) =>
						this.getTestContent( test, id )
					) }
				</div>
			</div>
		);
	}
}
