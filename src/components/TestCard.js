import React from 'react';
import StatusBadge from './StatusBadge';
import TestResultTimeline from './TestResultTimeline';

const TestCard = React.memo( ( { test, reportDeepUrl } ) => {
	const getTotalsBadges = React.useMemo( () => {
		const badges = [];

		// Show passed only if it's 100%
		if ( test.passed === test.total ) {
			badges.push( <StatusBadge key="passed" status="passed" content={ `all passed` } /> );
		} else {
			// Show failed if > 0
			if ( test.failed > 0 ) {
				const failedRate = ( ( test.failed / test.total ) * 100 ).toFixed( 1 );
				badges.push(
					<StatusBadge key="failed" status="failed" content={ `${ failedRate }% failed` } />
				);
			}

			// Show skipped if > 0
			if ( test.skipped > 0 ) {
				const skippedRate = ( ( test.skipped / test.total ) * 100 ).toFixed( 1 );
				badges.push(
					<StatusBadge key="skipped" status="skipped" content={ `${ skippedRate }% skipped` } />
				);
			}
		}

		return badges;
	}, [ test.passed, test.failed, test.skipped, test.total ] );

	return (
		<div className="test-container">
			<div className="row">
				<div className="col">
					{ ( () => {
						const parts = test.name.split( '#' );
						if ( parts.length === 2 ) {
							return (
								<>
									<div className="test-name">{ parts[ 1 ].trim() }</div>
									<div className="test-suite">{ parts[ 0 ].trim() }</div>
								</>
							);
						}
						return <div className="test-name">{ test.name }</div>;
					} )() }
				</div>
				<div className="col-auto">{ getTotalsBadges }</div>
			</div>
			<div className="row">
				<TestResultTimeline results={ test.results } reportDeepUrl={ reportDeepUrl } />
			</div>
		</div>
	);
} );

export default TestCard;
