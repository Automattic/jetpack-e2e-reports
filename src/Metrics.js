import React from 'react';
import E2EMetrics from './components/E2EMetrics';
import PerfMetrics from './components/PerfMetrics';
export default class Metrics extends React.Component {
	render() {
		return (
			<div>
				<span>METRICS</span>
				<E2EMetrics />
				<PerfMetrics />
			</div>
		);
	}
}
