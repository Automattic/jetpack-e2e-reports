import { Table } from 'react-bootstrap';
import React from 'react';

import Data from './summary.json';

function reportLink( report ) {
	const linkUrl = `https://automattic.github.io/jetpack-e2e-reports/${ report.name }/report/`;

	let name = `Branch: ${ report.name }`;
	if ( isNumeric( report.name ) ) {
		name = `PR #${ report.name }`;
	}
	return (
		<a href={ linkUrl } className="App-link">
			{ name }
		</a>
	);
}

function sortTable( sortBy ) {
	return Data.reports.sort( ( r1, r2 ) => {
		if ( r1[ sortBy ] > r2[ sortBy ] ) {
			return -1;
		}
		if ( r1[ sortBy ] < r2[ sortBy ] ) {
			return 1;
		}
		return 0;
	} );
}

function renderTableData( sortBy, sortDirection ) {
	const reports = sortTable( sortBy, sortDirection );
	return reports.map( ( report, id ) => {
		const { lastUpdate, statistic } = report; //destructuring
		return (
			<tr key={ id }>
				<td>{ reportLink( report ) }</td>
				<td>{ lastUpdate }</td>
				<td>
					<span className={ `label label-status-failed` }>
						{ statistic.failed }
					</span>{ ' ' }
					<span className={ `label label-status-passed` }>
						{ statistic.passed }
					</span>{ ' ' }
					<span className={ `label label-status-total` }>
						{ statistic.total }
					</span>
				</td>
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
				<tbody>{ renderTableData( this.state.sortingColName ) }</tbody>
			</Table>
		);
	}
}

function isNumeric( str ) {
	if ( typeof str !== 'string' ) return false; // we only process strings!
	return (
		! isNaN( str ) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
		! isNaN( parseFloat( str ) )
	); // ...and ensure strings of whitespace fail
}
