import React from 'react';

const StatusBadge = ( { status, content, badge } ) => {
	return (
		<span className={ `label label-status-${ status }` }>
			{ content }
			{ badge && <span className="badge-pill stat-pill">{ badge }</span> }
		</span>
	);
};

export default StatusBadge;
