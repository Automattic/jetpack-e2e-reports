import React from 'react';

const StatBox = ( { value, description, className = '' } ) => {
	return (
		<div className={ `stat-box ${ className }` }>
			<span className="stat-number">{ value }</span>
			<br />
			<span className="stat-description">{ description }</span>
		</div>
	);
};

export default StatBox;
