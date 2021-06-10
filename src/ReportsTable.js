import { Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import React from 'react';

import Data from './summary.json';

export default class ReportsTable extends React.Component {
	constructor( props ) {
		super( props );
		this.state = { sortBy: 'name', sortDirection: true };
	}

	updateSorting = ( sortBy, sortDirection ) =>
		this.setState( { sortBy, sortDirection } );

	render() {
		return (
			<Table bordered variant="dark" id="reportsTable">
				<thead>
					<tr>
						{ renderTableHeader(
							this.updateSorting,
							this.state.sortBy,
							this.state.sortDirection
						) }
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

function reportLink( report ) {
	const linkUrl = `https://automattic.github.io/jetpack-e2e-reports/${ report.name }/report/`;

	let name = `Branch: ${ report.name }`;
	if ( isNumeric( report.name ) ) {
		name = `PR #${ report.name }`;
	}
	return (
		<a
			href={ linkUrl }
			className="App-link"
			target="_blank"
			rel="noreferrer"
		>
			{ name }
		</a>
	);
}

function statusLabel( statistic ) {
	const isFailed = statistic.total !== statistic.passed;

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
				<span className={ `label label-status-${ label }` }>
					{ count }
				</span>
			</OverlayTrigger>
		);
	} );

	return (
		<div>
			<span>{ `Tests ${ isFailed ? 'failed' : 'passed' }: ` }</span>
			{ counts }
		</div>
	);
}

const localeDate = ( dateString ) =>
	new Date( Date.parse( dateString ) ).toLocaleString();

function renderTableData( sortBy, sortDirection ) {
	const reports = sortTable( sortBy, sortDirection );
	return reports.map( ( report, id ) => {
		const { lastUpdate, statistic } = report; //destructuring
		return (
			<tr key={ id }>
				<td>{ reportLink( report ) }</td>
				<td>{ localeDate( lastUpdate ) }</td>
				<td>{ statusLabel( statistic ) }</td>
			</tr>
		);
	} );
}

function renderTableHeader( updateSorting, sortBy, sortDirection ) {
	const head = Object.keys( Data.reports[ 0 ] );

	const klass = sortDirection ? 'sort-by-asc' : 'sort-by-desc';
	return head.map( ( key, index ) => {
		return (
			<th
				key={ index }
				onClick={ () => {
					updateSorting( key, ! sortDirection );
				} }
			>
				{ key.replace( /([a-z0-9])([A-Z])/g, '$1 $2' ).toUpperCase() }
				<span className={ sortBy === key ? klass : '' } />
			</th>
		);
	} );
}

// ========================================
// Some helper functions

const capitalize = ( s ) => s.charAt( 0 ).toUpperCase() + s.slice( 1 );

function isNumeric( str ) {
	if ( typeof str !== 'string' ) return false; // we only process strings!
	return (
		! isNaN( str ) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		! isNaN( parseFloat( str ) )
	); // ...and ensure strings of whitespace fail
}
