import { Button, FormControl, InputGroup } from 'react-bootstrap';
import moment from 'moment';

const DateFilterFields = ( { onDateChange } ) => {
	const dateFormat = 'YYYY-MM-DD';

	function getValidDate( controlId, fallbackValue ) {
		const element = document.getElementById( controlId );
		return element.value ? element.value : fallbackValue;
	}

	function setDatePickersValues( start, end ) {
		const startDate = document.getElementById( 'startDate' );
		const endDate = document.getElementById( 'endDate' );
		startDate.value = start;
		endDate.value = end;
	}

	return (
		<div className="col filters">
			<InputGroup>
				{ [
					[ 'today', 0 ],
					[ 'last 7 days', 7 ],
					[ 'last 14 days', 14 ],
				].map( ( e, index ) => (
					<Button
						key={ index }
						variant="dark"
						className="filter-btn"
						onClick={ () => {
							setDatePickersValues(
								moment().subtract( e[ 1 ], 'd' ).format( dateFormat ),
								moment().format( dateFormat )
							);
							onDateChange( {
								startDate: getValidDate( 'startDate', '1970-01-01' ),
								endDate: getValidDate( 'endDate', moment().format( dateFormat ) ),
							} );
						} }
					>
						{ e[ 0 ] }
					</Button>
				) ) }
				<FormControl
					type="date"
					id="startDate"
					max={ moment().format( dateFormat ) }
					onChange={ () => {
						const endDateElement = document.getElementById( 'endDate' );
						const minDate = getValidDate( 'startDate', '2021-10-01' );
						endDateElement.setAttribute( 'min', minDate );
						if (
							moment( endDateElement.value ).format( dateFormat ) <
							moment( minDate ).format( dateFormat )
						) {
							endDateElement.value = minDate;
						}
					} }
				/>
				<FormControl
					className=""
					type="date"
					id="endDate"
					max={ moment().format( 'YYYY-MM-DD' ) }
				/>
				<Button
					variant="dark"
					className="filter-btn"
					onClick={ () => {
						onDateChange( {
							startDate: getValidDate( 'startDate', '1970-01-01' ),
							endDate: getValidDate( 'endDate', moment().format( dateFormat ) ),
						} );
					} }
				>
					Apply
				</Button>
			</InputGroup>
		</div>
	);
};

export default DateFilterFields;
