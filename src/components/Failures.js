import React from 'react';
import ReactGA from 'react-ga';
import { Badge } from 'react-bootstrap';
import * as path from 'path';
import * as fs from 'fs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons';

export default class Failures extends React.Component {
	state = {
		errors: [],
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

			console.log( error.tests );
		}

		errors.sort( ( a, b ) => {
			return b.results.length - a.results.length;
		} );

		return (
			<div>
				{ errors.map( ( error, id ) =>
					this.getErrorContent( error, id )
				) }
			</div>
		);
	}
}
