import React from 'react';
import moment from 'moment';

const ErrorCard = ( { error, getListOfTests, getListOfFailures } ) => {
	let details = `${ error.total } times, since ${ moment(
		error.oldest
	).fromNow() }. Last failed ${ moment( error.newest ).fromNow() }`;

	if ( error.total === 1 ) {
		details = `once, ${ moment( error.oldest ).fromNow() }`;
	}

	return (
		<div className="error-container">
			<div className="row">
				<pre className="error-container-trace">{ error.trace }</pre>
				<div>{ details }</div>
			</div>
			<div className="row">{ getListOfTests( error.tests ) }</div>
			<div className="row">{ getListOfFailures( error.results ) }</div>
		</div>
	);
};

export default ErrorCard;
