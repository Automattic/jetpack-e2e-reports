import React from 'react';

const StatusBadge = ( { status, content, badge, className = '' } ) => {
	return (
		<span className={ `label label-status-${ status } ${ className }` }>
			{ content }
			{ badge && <span className="badge-pill stat-pill">{ badge }</span> }
		</span>
	);
};

export default StatusBadge;
