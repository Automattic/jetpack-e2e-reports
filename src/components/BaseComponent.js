import React from 'react';
import { Button } from 'react-bootstrap';
import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
		const icon = this.state.isMasterOnly ? faCheckSquare : faSquare;

		return (
			<Button
				variant="dark"
				className="filter-btn"
				onClick={ () => {
					this.setState( {
						isMasterOnly: ! this.state.isMasterOnly,
					} );
				} }
			>
				<FontAwesomeIcon icon={ icon } /> master only
			</Button>
		);
	}
}
