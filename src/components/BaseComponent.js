import React from 'react';
import { Button, FormControl } from 'react-bootstrap';
import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';

export default class BaseComponent extends React.Component {
	getSortButtons( sortOptions, currentSortStateBy, currentSortStateIsAsc ) {
		const cssClass = currentSortStateIsAsc ? 'sort-by-asc' : 'sort-by-desc';

		return Object.keys( sortOptions ).map( ( key, index ) => {
			return (
				<Button
					variant="dark"
					key={ index }
					onClick={ () => {
						this.sortData( key, ! currentSortStateIsAsc );
					} }
				>
					{ sortOptions[ key ].toUpperCase() }
					{
						<span
							className={
								currentSortStateBy === key ? cssClass : ''
							}
						/>
					}
				</Button>
			);
		} );
	}

	getMasterOnlyFilterButton() {
		const icon = this.state.filters.isMasterOnly ? faCheckSquare : faSquare;

		return (
			<Button
				variant="dark"
				className="filter-btn"
				onClick={ () => {
					this.setState( {
						filters: { isMasterOnly: ! this.state.filters.isMasterOnly },
					} );
				} }
			>
				<FontAwesomeIcon icon={ icon } /> master only
			</Button>
		);
	}

	getFilterByDateFields() {
		const dateFormat = 'YYYY-MM-DD';
		function getValidDate( controlId, fallbackValue ) {
			const element = document.getElementById( controlId );
			return element.value ? element.value : fallbackValue;
		}

		return (
			<div>
				<FormControl type="date" id="startDate"
					max={ moment().format( dateFormat ) }
					onChange={ () => {
						const endDateElement = document.getElementById( 'endDate' );
						const minDate = getValidDate( 'startDate', '1970-01-01' );
						endDateElement.setAttribute( 'min', minDate );
						if ( moment( endDateElement.value ).format( dateFormat ) < moment( minDate ).format( dateFormat ) ) {
							endDateElement.value = minDate;
						}
					} }
				/>
				<FormControl type="date" id="endDate"
					max={ moment().format( 'YYYY-MM-DD' ) } />
				<Button
					variant="dark"
					className="filter-btn"
					onClick={ () => {
						this.setState( {
							filters: { startDate: getValidDate( 'startDate', '1970-01-01' ), endDate: getValidDate( 'endDate', moment().format( dateFormat ) ) },
						} );
					} }
				>Apply</Button>
			</div>
		);
	}

	renderDefaultDateFilterValues() {
		const startDate = document.getElementById( 'startDate' );
		const endDate = document.getElementById( 'endDate' );
		startDate.value = this.state.filters.startDate;
		endDate.value = this.state.filters.endDate;
	}
}
