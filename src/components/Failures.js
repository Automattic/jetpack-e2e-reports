import React from 'react';
import ReactGA from 'react-ga';

export default class Failures extends React.Component {
	state = {
		errors: [],
		lastUpdate: undefined,
		isDataFetched: false,
	};

	componentDidMount() {
		fetch( './data/errors.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		} )
			.then( ( response ) => response.json() )
			.then( ( jsonData ) => {
				this.setState( {
					errors: jsonData.errors,
					lastUpdate: jsonData.lastUpdate,
					isDataFetched: true,
				} );
			} )
			.catch( console.log );
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

		// let badge = `${ result.test }\n
		// 					${ result.report }, ${ new Date( result.time ).toLocaleString() }`;

		// if ( result.source ) {
		// 	const sourceUrl = `${ result.report }/report/#testresult/${ result.source }`;
		// 	badge = (
		// 		<a
		// 			className="report-link"
		// 			href={ sourceUrl }
		// 			target="_blank"
		// 			rel="noreferrer"
		// 		>
		// 			{ `${ result.test }` }
		// 			<br />
		// 			{ `${ result.report }, ${ new Date(
		// 				result.time
		// 			).toLocaleString() }` }
		// 		</a>
		// 	);
		// }

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
			<ul className="test-container-results list-unstyled">
				{ tests.slice( -100 ).map( ( test, id ) => {
					return (
						<li key={ id }>
							{ test.times.length } x { test.name }
						</li>
					);
				} ) }
			</ul>
		);
	}

	getErrorContent( error, id ) {
		return (
			<div className="error-container" key={ id }>
				<div className="error-container-header">
					<pre className="error-container-trace">{ error.trace }</pre>
				</div>
				<div className="error-container-stats">
					{ error.total } times since{ ' ' }
					{ new Date( error.oldest ).toLocaleString() }. Last failed
					on { new Date( error.oldest ).toLocaleString() }
				</div>
				<div className="error-container-tests-list">
					{ this.getListOfTests( error.tests ) }
				</div>
			</div>
		);
	}

	render() {
		if ( ! this.state.isDataFetched ) return null;

		const errors = this.state.errors;

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
				<div className="row">
					<div className="text-right col small">
						Last updated on { this.state.lastUpdate }
					</div>
				</div>
				{ errors.map( ( error, id ) =>
					this.getErrorContent( error, id )
				) }
			</div>
		);
	}
}
