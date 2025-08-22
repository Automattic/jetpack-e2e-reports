import React from 'react';
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

	updateTimer = null;

	componentDidMount() {
		this.updateDates( this.state.days );
	}

	componentWillUnmount() {
		if ( this.updateTimer ) {
			clearTimeout( this.updateTimer );
		}
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

	handleSliderChange = e => {
		const value = parseInt( e.target.value, 10 );
		this.setState( { days: value } );

		// Clear existing timer
		if ( this.updateTimer ) {
			clearTimeout( this.updateTimer );
		}

		// Set new timer to update after 1 second of no changes
		this.updateTimer = setTimeout( () => {
			this.updateDates( value );
		}, 1000 );
	};

	handleSliderMouseUp = () => {
		// Clear the timer and update immediately when user stops dragging
		if ( this.updateTimer ) {
			clearTimeout( this.updateTimer );
		}
		this.updateDates( this.state.days );
	};

	render() {
		const { min, max, step } = this.props;
		const { days } = this.state;

		// Calculate percentage for gradient background and thumb position
		const percentage = ( ( days - min ) / ( max - min ) ) * 100;

		return (
			<div
				className="filter-days-selector"
				style={ { display: 'flex', alignItems: 'center', gap: '10px' } }
			>
				<span
					style={ {
						fontSize: '12px',
						color: '#6c757d',
						minWidth: '30px',
						textAlign: 'right',
						lineHeight: '18px',
					} }
				>
					{ min }
				</span>
				<div
					style={ {
						flex: 1,
						position: 'relative',
						display: 'flex',
						alignItems: 'center',
						paddingTop: '25px',
					} }
				>
					<div
						style={ {
							position: 'absolute',
							left: `${ percentage }%`,
							top: '0',
							transform: 'translateX(-50%)',
							background: '#343a40',
							color: '#fff',
							padding: '2px 8px',
							borderRadius: '4px',
							fontSize: '12px',
							fontWeight: 'bold',
							whiteSpace: 'nowrap',
							pointerEvents: 'none',
							zIndex: 1,
						} }
					>
						{ days } { days === 1 ? 'day' : 'days' }
					</div>
					<input
						type="range"
						min={ min }
						max={ max }
						step={ step }
						value={ days }
						onChange={ this.handleSliderChange }
						onMouseUp={ this.handleSliderMouseUp }
						onTouchEnd={ this.handleSliderMouseUp }
						style={ {
							width: '100%',
							height: '6px',
							background: `linear-gradient(to right, #fff ${ percentage }%, #6c757d ${ percentage }%)`,
							borderRadius: '3px',
							outline: 'none',
							WebkitAppearance: 'none',
							appearance: 'none',
							cursor: 'pointer',
						} }
						className="days-slider"
					/>
					<style>
						{ `
							.days-slider::-webkit-slider-thumb {
								-webkit-appearance: none;
								appearance: none;
								width: 18px;
								height: 18px;
								border-radius: 50%;
								background: #fff;
								cursor: pointer;
								border: 2px solid #343a40;
								box-shadow: 0 2px 4px rgba(0,0,0,0.2);
							}
							.days-slider::-moz-range-thumb {
								width: 18px;
								height: 18px;
								border-radius: 50%;
								background: #fff;
								cursor: pointer;
								border: 2px solid #343a40;
								box-shadow: 0 2px 4px rgba(0,0,0,0.2);
							}
							.days-slider::-webkit-slider-thumb:hover {
								background: #f8f9fa;
								transform: scale(1.1);
							}
							.days-slider::-moz-range-thumb:hover {
								background: #f8f9fa;
								transform: scale(1.1);
							}
						` }
					</style>
				</div>
				<span
					style={ {
						fontSize: '12px',
						color: '#6c757d',
						minWidth: '30px',
						textAlign: 'left',
						lineHeight: '18px',
					} }
				>
					{ max }
				</span>
			</div>
		);
	}
}
