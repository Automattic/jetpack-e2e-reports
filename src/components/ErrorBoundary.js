import React from 'react';

class ErrorBoundary extends React.Component {
	constructor( props ) {
		super( props );
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch( error, errorInfo ) {
		console.error( 'ErrorBoundary caught an error:', error, errorInfo );
		this.setState( {
			error,
			errorInfo,
		} );
	}

	render() {
		if ( this.state.hasError ) {
			return (
				<div className="error-container" role="alert" aria-live="assertive">
					<h2>Something went wrong</h2>
					<p>An unexpected error occurred while rendering this component.</p>
					{ this.props.showDetails && (
						<details>
							<summary>Error Details</summary>
							<div className="error-container-trace" role="region" aria-label="Error stack trace">
								{ this.state.error && this.state.error.toString() }
								<br />
								{ this.state.errorInfo.componentStack }
							</div>
						</details>
					) }
					<button
						className="btn btn-primary"
						onClick={ () => this.setState( { hasError: false, error: null, errorInfo: null } ) }
						onKeyDown={ e => {
							if ( e.key === 'Enter' || e.key === ' ' ) {
								e.preventDefault();
								this.setState( { hasError: false, error: null, errorInfo: null } );
							}
						} }
						aria-label="Try to reload the component"
					>
						Try again
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
