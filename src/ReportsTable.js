import { Table, Badge, Button } from 'react-bootstrap';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCheck,
	faCodeBranch,
	faTimes,
} from '@fortawesome/free-solid-svg-icons';

export default class ReportsTable extends React.Component {
	constructor( props ) {
		super( props );
		this.state = {
			data: { reports: [] },
			sortBy: 'lastUpdate',
			isSortAsc: false,
		};
	}

	componentDidMount() {
		fetch( './summary.json', {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
			},
		} )
			.then( ( response ) => response.json() )
			.then( ( jsonData ) => {
				this.setState( { data: jsonData } );
			} )
			.catch( console.log );
	}

	updateSorting = ( sortBy, isSortAsc ) =>
		this.setState( { sortBy, isSortAsc } );

	sortTable( sortBy, isSortAsc ) {
		switch ( sortBy ) {
			case 'name':
				return this.sortAlphabetically( isSortAsc );
			case 'lastUpdate':
				return this.sortByDate( isSortAsc );
			case 'statistic':
				return this.sortByStatus( isSortAsc );
		}
	}

	sortByDate( isSortAsc ) {
		return this.state.data.reports.sort( ( r1, r2 ) => {
			if ( isSortAsc ) {
				return (
					Date.parse( r1.lastUpdate ) - Date.parse( r2.lastUpdate )
				);
			}
			return Date.parse( r2.lastUpdate ) - Date.parse( r1.lastUpdate );
		} );
	}

	sortAlphabetically( isSortAsc ) {
		return this.state.data.reports.sort( ( r1, r2 ) =>
			isSortAsc ? r1.name - r2.name : r2.name - r1.name
		);
	}

	sortByStatus( isSortAsc ) {
		return this.state.data.reports.sort( ( r1, r2 ) => {
			if ( isSortAsc ) {
				return (
					r1.statistic.failed +
					r1.statistic.broken -
					( r2.statistic.failed + r2.statistic.broken )
				);
			}
			return (
				r2.statistic.failed +
				r2.statistic.broken -
				( r1.statistic.failed + r1.statistic.broken )
			);
		} );
	}

	renderReportLink( report, metadata, isFailed ) {
		const linkUrl = `https://automattic.github.io/jetpack-e2e-reports/${ report.name }/report/`;

		const reportKey = report.name;
		let reportTitle = report.name;

		if ( metadata.pr_title ) {
			let prNumber = '';
			prNumber = `(#${ metadata.pr_number })`;
			reportTitle = `${ metadata.pr_title } ${ prNumber }`;
		}

		const branchUrl = `https://github.com/Automattic/jetpack/tree/${ metadata.branch }`;
		const prUrl = `https://github.com/Automattic/jetpack/pull/${ metadata.pr_number }`;

		return (
			<ul className={ 'list-unstyled' }>
				<li>
					<FontAwesomeIcon
						className={ isFailed ? 'failed' : 'passed' }
						icon={ isFailed ? faTimes : faCheck }
					/>
					&nbsp;
					<a
						href={ linkUrl }
						className="report-link"
						target="_blank"
						rel="noreferrer"
					>
						{ reportTitle }
						<br />
					</a>
				</li>
				<li>
					<small>
						#{ reportKey } { ' • ' }
						<FontAwesomeIcon icon={ faCodeBranch } />{ ' ' }
						<a
							href={ branchUrl }
							target={ '_blank' }
							className={ 'report-link' }
							rel="noreferrer"
						>
							{ metadata.branch }
						</a>
						{ metadata.pr_number ? ' • ' : '' }
						{ metadata.pr_number && (
							<a
								href={ prUrl }
								target={ '_blank' }
								className={ 'report-link' }
								rel={ 'noreferrer' }
							>
								PR { metadata.pr_number }
							</a>
						) }
					</small>
				</li>
			</ul>
		);
	}

	renderResults( statistic ) {
		const counts = [ 'failed', 'passed', 'total' ].map( ( label, id ) => {
			const count =
				label === 'failed'
					? statistic[ label ] + statistic.broken
					: statistic[ label ];
			return (
				<Badge key={ id } className={ `label label-status-${ label }` }>
					{ label } { count }
				</Badge>
			);
		} );

		return <div>{ counts }</div>;
	}

	renderMetadataCell( report ) {
		const runUrl = `https://github.com/Automattic/jetpack/actions/runs/${ report.metadata.run_id }`;
		return (
			<ul className={ 'list-unstyled' }>
				<li>
					<small>
						last update:{ ' ' }
						{ new Date(
							Date.parse( report.lastUpdate )
						).toLocaleString() }
					</small>
				</li>
				<li>
					<small>
						last run id:{ ' ' }
						<a
							href={ runUrl }
							target={ '_blank' }
							className={ 'report-link' }
							rel="noreferrer"
						>
							{ report.metadata.run_id }
						</a>
					</small>
				</li>
			</ul>
		);
	}

	renderTableData( sortBy, sortDirection ) {
		const reports = this.sortTable( sortBy, sortDirection );
		return reports.map( ( report, id ) => {
			const { statistic, metadata } = report; //destructuring
			const isFailed = statistic.total !== statistic.passed + statistic.skipped;
			return (
				<tr key={ id }>
					<td>
						{ this.renderReportLink( report, metadata, isFailed ) }
					</td>
					<td>{ this.renderResults( statistic ) }</td>
					<td>{ this.renderMetadataCell( report ) }</td>
				</tr>
			);
		} );
	}

	renderTableHeader( updateSorting, sortBy, sortDirection ) {
		const head = {
			name: 'report id',
			statistic: 'results',
			lastUpdate: 'most recent',
		};

		const klass = sortDirection ? 'sort-by-asc' : 'sort-by-desc';

		const sortButtons = Object.keys( head ).map( ( key, index ) => {
			return (
				<Button
					variant="dark"
					key={ index }
					onClick={ () => {
						updateSorting( key, ! sortDirection );
					} }
				>
					{ head[ key ].toUpperCase() }
					<span className={ sortBy === key ? klass : '' } />
				</Button>
			);
		} );

		return (
			<div className={ 'd-flex justify-content-between' }>
				<div>{ this.state.data.reportsCount } reports</div>
				<div>{ sortButtons }</div>
			</div>
		);
	}

	render() {
		return (
			<Table
				hover
				responsive="sm"
				size="sm"
				variant="dark"
				id="reportsTable"
			>
				<caption>
					<small>docs size: { this.state.data.docsSize }</small>
				</caption>
				<thead>
					<tr>
						<th colSpan="3">
							<h1 className={ 'display-4' }>
								Jetpack e2e test reports
							</h1>
						</th>
					</tr>
					<tr>
						<td colSpan="3" id={ 'sortButtons' }>
							{ this.renderTableHeader(
								this.updateSorting,
								this.state.sortBy,
								this.state.isSortAsc
							) }
						</td>
					</tr>
				</thead>
				<tbody>
					{ this.renderTableData(
						this.state.sortBy,
						this.state.isSortAsc
					) }
				</tbody>
			</Table>
		);
	}
}
