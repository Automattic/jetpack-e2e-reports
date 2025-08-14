import { Form } from 'react-bootstrap';

const ReportFilterDropdown = ( { availableReports, selectedReport, onChange } ) => {
	const currentReport = selectedReport || 'trunk';

	return (
		<Form.Select
			variant="dark"
			className="report-filter-dropdown"
			value={ currentReport }
			onChange={ e => {
				onChange( e.target.value );
			} }
			style={ {
				width: 'auto',
				display: 'inline-block',
				backgroundColor: '#343a40',
				color: '#fff',
				border: '1px solid #495057',
				backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
				backgroundRepeat: 'no-repeat',
				backgroundPosition: 'right .75rem center',
				backgroundSize: '16px 12px',
				paddingRight: '2.5rem',
			} }
		>
			{ availableReports.map( ( report, index ) => (
				<option key={ index } value={ report }>
					{ report }
				</option>
			) ) }
		</Form.Select>
	);
};

export default ReportFilterDropdown;
