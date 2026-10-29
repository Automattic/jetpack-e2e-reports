import React from 'react';
import moment from 'moment';

const TestResultTimeline = ( { results, limit = 500 } ) => {
	const badges = results.slice( -limit ).map( ( result, id ) => {
		return (
			<span
				key={ id }
				className={ `has-tooltip label label-small label-status-${ result.status }` }
				aria-hidden="true"
			>
				&nbsp;
				<span className="tooltip-content">
					{ moment( result.time ).format( 'MMM Do, h:mm a' ) }
					<br />
					{ result.source }
				</span>
			</span>
		);
	} );

	return <div className="test-result-timeline">{ badges }</div>;
};

export default TestResultTimeline;
