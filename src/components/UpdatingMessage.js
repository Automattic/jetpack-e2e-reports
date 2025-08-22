import React from 'react';

const UpdatingMessage = ( { isUpdating, updatingText = 'Updating...' } ) => {
	if ( isUpdating ) {
		return <div className="loading-state">{ updatingText }</div>;
	}
	return null;
};

export default UpdatingMessage;
