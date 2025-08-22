import React from 'react';
import { Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';

export default class FilterDaysSelector extends React.Component {
	static defaultProps = {
		min: 1,
		max: 30,
		step: 1,
		defaultDays: 14,
	};

	state = {
		days: this.props.defaultDays || 14,
	};

	componentDidMount() {
		this.updateDates( this.state.days );
	}

	updateDates = days => {
		const startDate = moment().subtract( days, 'd' ).format( 'YYYY-MM-DD' );
		const endDate = moment().format( 'YYYY-MM-DD' );
		
		if ( this.props.onDateChange ) {
			this.props.onDateChange( {
				startDate,
				endDate,
				days,
			} );
		}
	};

	handleDecrease = () => {
		const newDays = Math.max( this.props.min, this.state.days - this.props.step );
		this.setState( { days: newDays } );
		this.updateDates( newDays );
	};

	handleIncrease = () => {
		const newDays = Math.min( this.props.max, this.state.days + this.props.step );
		this.setState( { days: newDays } );
		this.updateDates( newDays );
	};

	render() {
		const { min, max } = this.props;
		const { days } = this.state;

		return (
			<div className="filter-days-selector">
				<Button
					variant="dark"
					className="filter-btn"
					onClick={ this.handleDecrease }
					disabled={ days <= min }
				>
					<FontAwesomeIcon icon={ faMinus } />
				</Button>
				<Button
					variant="dark"
					className="filter-btn filter-btn-days"
					disabled
				>
					{ days } { days === 1 ? 'DAY' : 'DAYS' }
				</Button>
				<Button
					variant="dark"
					className="filter-btn"
					onClick={ this.handleIncrease }
					disabled={ days >= max }
				>
					<FontAwesomeIcon icon={ faPlus } />
				</Button>
			</div>
		);
	}
}