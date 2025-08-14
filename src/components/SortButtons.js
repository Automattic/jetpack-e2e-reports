import { Button } from 'react-bootstrap';

const SortButtons = ( { sortOptions, currentSortStateBy, currentSortStateIsAsc, onSort } ) => {
	const cssClass = currentSortStateIsAsc ? 'sort-by-asc' : 'sort-by-desc';

	return Object.keys( sortOptions ).map( ( key, index ) => {
		return (
			<Button
				variant="dark"
				className="filter-btn"
				key={ index }
				onClick={ () => {
					onSort( key, ! currentSortStateIsAsc );
				} }
			>
				{ sortOptions[ key ].toUpperCase() }
				{ <span className={ currentSortStateBy === key ? cssClass : '' } /> }
			</Button>
		);
	} );
};

export default SortButtons;
