import { Table, OverlayTrigger, Tooltip, Badge, Button } from 'react-bootstrap';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCheck,
	faCodeBranch,
	faTimes,
} from '@fortawesome/free-solid-svg-icons';

import Data from './summary.json';

export default class ReportsTable extends React.Component {
	constructor( props ) {
		super( props );
		this.state = { sortBy: 'lastUpdate', sortDirection: false };
	}

	updateSorting = ( sortBy, sortDirection ) =>
		this.setState( { sortBy, sortDirection } );

	render() {
		return (
			<Table hover size="sm" variant="dark" id="reportsTable">
				<thead>
					<tr>
						<th colSpan="3" id={ 'sortButtons' }>
							{ renderTableHeader(
								this.updateSorting,
								this.state.sortBy,
								this.state.sortDirection
							) }
						</th>
					</tr>
				</thead>
				<tbody>
					{ renderTableData(
						this.state.sortBy,
						this.state.sortDirection
					) }
				</tbody>
			</Table>
		);
	}
}

function sortTable( sortBy, direction ) {
	console.log( '!!!!!', sortBy, direction );
	switch ( sortBy ) {
		case 'name':
			return sortAlphabetically( direction );
		case 'lastUpdate':
			return sortByDate( direction );
		case 'statistic':
			return sortByStatus( direction );
	}
}

function sortByDate( direction ) {
	return Data.reports.sort( ( r1, r2 ) => {
		if ( direction ) {
			return Date.parse( r1.lastUpdate ) - Date.parse( r2.lastUpdate );
		}
		return Date.parse( r2.lastUpdate ) - Date.parse( r1.lastUpdate );
	} );
}

function sortAlphabetically( direction ) {
	return Data.reports.sort( ( r1, r2 ) =>
		direction ? r1.name - r2.name : r2.name - r1.name
	);
}

function sortByStatus( direction ) {
	return Data.reports.sort( ( r1, r2 ) => {
		if ( direction ) {
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

function reportLink( report, metadata, isFailed ) {
	const linkUrl = `https://automattic.github.io/jetpack-e2e-reports/${ report.name }/report/`;

	const reportKey = report.name;
	let reportTitle = report.name;

	if ( metadata.pr_title ) {
		let prNumber = '';
		if ( metadata.pr ) {
			prNumber = `(#${ metadata.pr })`;
		} else if ( metadata.pr_number ) {
			prNumber = `(#${ metadata.pr_number })`;
		}
		reportTitle = `${ metadata.pr_title } ${ prNumber }`;
	}

	return (
		<span>
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
			<sub>
				#{ reportKey } { ' • ' }
				<FontAwesomeIcon icon={ faCodeBranch } /> { metadata.branch }
			</sub>
		</span>
	);
}

function statusLabel( statistic ) {
	const counts = [ 'failed', 'passed', 'total' ].map( ( label, id ) => {
		const count =
			label === 'failed'
				? statistic[ label ] + statistic.broken
				: statistic[ label ];
		return (
			<OverlayTrigger
				key={ id }
				placement="right"
				delay={ { show: 250, hide: 400 } }
				overlay={
					<Tooltip id={ `tooltip-${ label }` }>
						{ capitalize( label ) + ' tests' }
					</Tooltip>
				}
			>
				<Badge className={ `label label-status-${ label }` }>
					{ label } { count }
				</Badge>
			</OverlayTrigger>
		);
	} );

	return <div>{ counts }</div>;
}

const localeDate = ( dateString ) =>
	new Date( Date.parse( dateString ) ).toLocaleString();

function renderTableData( sortBy, sortDirection ) {
	const reports = sortTable( sortBy, sortDirection );
	return reports.map( ( report, id ) => {
		const { lastUpdate, statistic, metadata } = report; //destructuring
		const isFailed = statistic.total !== statistic.passed;
		return (
			<tr key={ id }>
				<td>{ reportLink( report, metadata, isFailed ) }</td>
				<td>{ statusLabel( statistic ) }</td>
				<td>{ localeDate( lastUpdate ) }</td>
			</tr>
		);
	} );
}

function renderTableHeader( updateSorting, sortBy, sortDirection ) {
	const head = {
		name: 'report id',
		statistic: 'results',
		lastUpdate: 'last update',
	};

	const klass = sortDirection ? 'sort-by-asc' : 'sort-by-desc';

	return Object.keys( head ).map( ( key, index ) => {
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
}

// ========================================
// Some helper functions

const capitalize = ( s ) => s.charAt( 0 ).toUpperCase() + s.slice( 1 );
