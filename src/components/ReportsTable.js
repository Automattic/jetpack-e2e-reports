import { Table, Button } from 'react-bootstrap';
import { useState, useEffect, useCallback, useMemo } from 'react';
import ReportRow from './ReportRow';

export default function ReportsTable( { reports, options = {}, reportCount } ) {
	const [ sortedReports, setSortedReports ] = useState( reports );
	const [ sort, setSort ] = useState( { by: 'lastUpdate', isAsc: false } );

	useEffect( () => {
		setSortedReports( reports );
	}, [ reports ] );

	useEffect( () => {
		sortTable( sort.by, sort.isAsc );
	}, [] ); // Only run on mount

	const sortTable = useCallback( ( by, isAsc ) => {
		setSort( { by, isAsc } );

		setSortedReports( prevReports => {
			const newReports = [ ...prevReports ];
			switch ( by ) {
				case 'name':
					return newReports.sort( ( r1, r2 ) => ( isAsc ? r1.name - r2.name : r2.name - r1.name ) );
				case 'lastUpdate':
					return newReports.sort( ( r1, r2 ) => {
						if ( isAsc ) {
							return Date.parse( r1.lastUpdate ) - Date.parse( r2.lastUpdate );
						}
						return Date.parse( r2.lastUpdate ) - Date.parse( r1.lastUpdate );
					} );
				case 'statistic':
					return newReports.sort( ( r1, r2 ) => {
						if ( isAsc ) {
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
				default:
					return newReports;
			}
		} );
	}, [] );

	const getTableHeader = useCallback( () => {
		const head = {
			name: 'report id',
			statistic: 'no of failures',
			lastUpdate: 'most recent',
		};

		const klass = sort.isAsc ? 'sort-by-asc' : 'sort-by-desc';
		let sortButtons;

		if ( options.sortButtons ) {
			sortButtons = Object.keys( head ).map( ( key, index ) => {
				return (
					<Button
						variant="dark"
						className="filter-btn"
						key={ index }
						onClick={ () => {
							sortTable( key, ! sort.isAsc );
						} }
					>
						{ head[ key ].toUpperCase() }
						{ <span className={ sort.by === key ? klass : '' } /> }
					</Button>
				);
			} );
		}

		let reportCountDisplay;
		if ( reportCount ) {
			reportCountDisplay = `${ sortedReports.length } reports`;
		}

		return (
			<thead>
				<tr className={ 'headerRow' }>
					<td colSpan="3" className={ 'sort-buttons' }>
						<div className={ 'd-flex justify-content-between' }>
							<div>{ reportCountDisplay }</div>
							<div>{ sortButtons }</div>
						</div>
					</td>
				</tr>
			</thead>
		);
	}, [ sort, options.sortButtons, reportCount, sortedReports.length, sortTable ] );

	const tableHeader = useMemo( () => getTableHeader(), [ getTableHeader ] );

	return (
		<Table size="sm" responsive="sm" borderless className="reportsTable">
			{ tableHeader }
			<tbody>
				{ sortedReports.map( ( report, id ) => (
					<ReportRow key={ id } report={ report } id={ id } />
				) ) }
			</tbody>
		</Table>
	);
}
