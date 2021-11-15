import React from 'react';
import { Badge } from 'react-bootstrap';
import ReactGA from 'react-ga';

export default class Tests extends React.Component {
	state = {
		tests: [],
		isDataFetched: false,
	};

	componentDidMount() {
		fetch( './data/tests.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		} )
			.then( ( response ) => response.json() )
			.then( ( jsonData ) => {
				this.setState( {
					tests: jsonData.tests,
					isDataFetched: true,
				} );
			} )
			.catch( console.log );
		ReactGA.pageview( '/tests' );
	}

	getTotalsBadges( test ) {
		const badges = [ 'failed', 'passed', 'skipped', 'total' ].map(
			( label, id ) => {
				let count = test[ label ];

				if ( label !== 'total' ) {
					const rate = (
						( count /
							( test.total -
								( label === 'skipped' ? 0 : test.skipped ) ) ) *
						100
					).toFixed( 1 );
					count = `${ isNaN( rate ) ? 0 : rate }% (${ count })`;
				}

				return (
					<Badge
						key={ id }
						className={ `label label-status-${ label }` }
					>
						{ label } { count }
					</Badge>
				);
			}
		);

		return <div className="test-container-totals-badges">{ badges }</div>;
	}

	getResultsLine( test ) {
		const badges = test.results.slice( -100 ).map( ( result, id ) => {
			return (
				<Badge
					key={ id }
					className={ `label label-small label-status-${ result.status }` }
				>
					&nbsp;
				</Badge>
			);
		} );
		return <div className="test-container-results">{ badges }</div>;
	}

	getTestContent( test, id ) {
		return (
			<div className="test-container" key={ id }>
				<div className="test-container-header">
					<h1>{ test.name }</h1>
				</div>
				{ this.getTotalsBadges( test ) }
				{ this.getResultsLine( test ) }
			</div>
		);
	}

	render() {
		if ( ! this.state.isDataFetched ) return null;

		const tests = this.state.tests;

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

		console.log( tests );

		return (
			<div>
				{ tests.map( ( test, id ) => this.getTestContent( test, id ) ) }
			</div>
		);
	}
}
