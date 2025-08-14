import React from 'react';

const LoadingState = ( { isLoading, children, loadingText = 'Loading...' } ) => {
	if ( isLoading ) {
		return <div className="loading-state">{ loadingText }</div>;
	}
	return children;
};

export default LoadingState;
