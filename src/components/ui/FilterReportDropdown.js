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
