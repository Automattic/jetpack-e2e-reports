import { Button } from 'react-bootstrap';

const SortButtons = ( { sortOptions, currentSortStateBy, currentSortStateIsAsc, onSort } ) => {
	const cssClass = currentSortStateIsAsc ? 'sort-by-asc' : 'sort-by-desc';
	const sortDirection = currentSortStateIsAsc ? 'ascending' : 'descending';

	return Object.keys( sortOptions ).map( ( key, index ) => {
		const isActive = currentSortStateBy === key;
		const ariaLabel = `Sort by ${ sortOptions[ key ] }${
			isActive ? `, currently sorted ${ sortDirection }` : ''
		}`;

		return (
			<Button
				variant="dark"
				className="filter-btn"
				key={ index }
				onClick={ () => {
					onSort( key, ! currentSortStateIsAsc );
				} }
				onKeyDown={ e => {
					if ( e.key === 'Enter' || e.key === ' ' ) {
						e.preventDefault();
						onSort( key, ! currentSortStateIsAsc );
					}
				} }
				aria-label={ ariaLabel }
				aria-pressed={ isActive }
			>
				{ sortOptions[ key ].toUpperCase() }
				{ <span className={ isActive ? cssClass : '' } aria-hidden="true" /> }
			</Button>
		);
	} );
};

export default SortButtons;
