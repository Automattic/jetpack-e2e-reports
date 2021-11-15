import React from 'react';
import ReactGA from 'react-ga';

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

	getErrorContent( error, id ) {
		return (
			<div className="error-container" key={ id }>
				<div className="error-container-header">
					<pre className="error-container-trace">{ error.trace }</pre>
				</div>
				<ul className="error-container-stats">
					<li>Total: { error.total }</li>
					<li>Newest: { error.newest }</li>
					<li>Oldest: { error.oldest }</li>
				</ul>
				<div className="error-container-tests-list"></div>
			</div>
		);
	}

	render() {
		if ( ! this.state.isDataFetched ) return null;

		const errors = this.state.errors;

		for ( const error of errors ) {
			error.total = error.results.length;
			const times = error.results.map( ( r ) => r.time );
			error.newest = Math.max( times );
			error.oldest = Math.max( times );
		}

		console.log( errors );

		return (
			<div>
				{ errors.map( ( error, id ) =>
					this.getErrorContent( error, id )
				) }
			</div>
		);
	}
}
