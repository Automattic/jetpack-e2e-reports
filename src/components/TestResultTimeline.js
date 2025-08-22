import React from 'react';
import moment from 'moment';

const TestResultTimeline = ( { results, reportDeepUrl, limit = 500 } ) => {
	const badges = results.slice( -limit ).map( ( result, id ) => {
		let classHasSource = 'no-source';
		let url;

		if ( result.source ) {
			classHasSource = '';
			url = `${ reportDeepUrl }/${ result.report }/report/#testresult/${ result.source.replace(
				/.json/,
				''
			) }`;
		}

		return (
			<span
				key={ id }
				onClick={ () => {
					if ( url ) {
						window.open( url, '_blank' );
					}
				} }
				className={ `has-tooltip label label-small label-status-${ result.status } ${ classHasSource }` }
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

	return <div className='test-result-timeline'>{ badges }</div>;
};

export default TestResultTimeline;
