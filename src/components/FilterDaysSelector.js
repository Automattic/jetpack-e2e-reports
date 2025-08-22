import React, { useState, useEffect, useCallback, useRef } from 'react';
import moment from 'moment';

export default function FilterDaysSelector( {
	min = 1,
	max = 30,
	step = 1,
	defaultDays = 14,
	onDateChange,
} ) {
	const [ days, setDays ] = useState( defaultDays || 14 );
	const updateTimerRef = useRef( null );

	const updateDates = useCallback(
		daysValue => {
			const startDate = moment().subtract( daysValue, 'd' ).format( 'YYYY-MM-DD' );
			const endDate = moment().format( 'YYYY-MM-DD' );

			if ( onDateChange ) {
				onDateChange( {
					startDate,
					endDate,
					days: daysValue,
				} );
			}
		},
		[ onDateChange ]
	);

	useEffect( () => {
		updateDates( days );
	}, [] ); // Only run on mount

	useEffect( () => {
		return () => {
			if ( updateTimerRef.current ) {
				clearTimeout( updateTimerRef.current );
			}
		};
	}, [] );

	const handleSliderChange = useCallback(
		e => {
			const value = parseInt( e.target.value, 10 );
			setDays( value );

			// Clear existing timer
			if ( updateTimerRef.current ) {
				clearTimeout( updateTimerRef.current );
			}

			// Set new timer to update after 1 second of no changes
			updateTimerRef.current = setTimeout( () => {
				updateDates( value );
			}, 1000 );
		},
		[ updateDates ]
	);

	const handleSliderMouseUp = useCallback( () => {
		// Clear the timer and update immediately when user stops dragging
		if ( updateTimerRef.current ) {
			clearTimeout( updateTimerRef.current );
		}
		updateDates( days );
	}, [ days, updateDates ] );

	// Calculate percentage for gradient background and thumb position
	const percentage = ( ( days - min ) / ( max - min ) ) * 100;

	return (
		<div
			className="filter-days-selector"
			style={ { display: 'flex', alignItems: 'center', gap: '10px' } }
		>
			<div
				style={ {
					flex: 1,
					position: 'relative',
					display: 'flex',
					alignItems: 'center',
					paddingTop: '35px',
					paddingBottom: '10px',
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
						padding: '4px 12px',
						borderRadius: '4px',
						fontSize: '14px',
						fontWeight: 'bold',
						whiteSpace: 'nowrap',
						pointerEvents: 'none',
						zIndex: 2,
					} }
				>
					{ days } { days === 1 ? 'day' : 'days' }
				</div>
				{ /* Track background with gradient */ }
				<div
					style={ {
						position: 'absolute',
						width: '100%',
						height: '10px',
						background: `linear-gradient(to right, #fff ${ percentage }%, #6c757d ${ percentage }%)`,
						borderRadius: '5px',
						pointerEvents: 'none',
						zIndex: 0,
					} }
				/>
				{ /* Tick marks for each day */ }
				<div
					style={ {
						position: 'absolute',
						width: '100%',
						height: '100%',
						pointerEvents: 'none',
						display: 'flex',
						alignItems: 'center',
						zIndex: 0,
					} }
				>
					{ Array.from( { length: Math.floor( ( max - min ) / step ) + 1 }, ( _, i ) => {
						const value = min + i * step;
						const tickPercentage = ( ( value - min ) / ( max - min ) ) * 100;

						// Skip first and last ticker marks
						if ( value === min || value === max ) {
							return null;
						}

						return (
							<div
								key={ value }
								style={ {
									position: 'absolute',
									left: `${ tickPercentage }%`,
									width: '2px',
									height: '14px',
									background: '#6c757d',
									opacity: 0.7,
									transform: 'translateX(-50%)',
								} }
							/>
						);
					} ) }
				</div>
				<input
					type="range"
					min={ min }
					max={ max }
					step={ step }
					value={ days }
					onChange={ handleSliderChange }
					onMouseUp={ handleSliderMouseUp }
					onTouchEnd={ handleSliderMouseUp }
					style={ {
						width: '100%',
						height: '10px',
						background: 'transparent',
						borderRadius: '5px',
						outline: 'none',
						WebkitAppearance: 'none',
						appearance: 'none',
						cursor: 'pointer',
						position: 'relative',
						zIndex: 1,
					} }
					className="days-slider"
				/>
				<style>
					{ `
						.days-slider::-webkit-slider-thumb {
							-webkit-appearance: none;
							appearance: none;
							width: 24px;
							height: 24px;
							border-radius: 50%;
							background: #fff;
							cursor: pointer;
							border: 2px solid #343a40;
							box-shadow: 0 2px 6px rgba(0,0,0,0.3);
						}
						.days-slider::-moz-range-thumb {
							width: 24px;
							height: 24px;
							border-radius: 50%;
							background: #fff;
							cursor: pointer;
							border: 2px solid #343a40;
							box-shadow: 0 2px 6px rgba(0,0,0,0.3);
						}
						.days-slider::-webkit-slider-thumb:hover {
							background: #f8f9fa;
							transform: scale(1.15);
						}
						.days-slider::-moz-range-thumb:hover {
							background: #f8f9fa;
							transform: scale(1.15);
						}
					` }
				</style>
			</div>
		</div>
	);
}
