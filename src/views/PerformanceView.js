import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import config from '../config';
import ReactEcharts from 'echarts-for-react';
import { fetchJsonData } from '../utils/fetch';

export default function Performance() {
	const [ selected, setSelected ] = useState( 'type' );
	const [ rawData, setRawData ] = useState( [] );
	const [ isDataFetched, setIsDataFetched ] = useState( false );
	const [ error, setError ] = useState( null );

	useEffect( () => {
		const fetchData = async () => {
			try {
				const data = await fetchJsonData( `${ config.dataSourceURL }/data/perf-metrics.json` );
				setRawData( data );
				setIsDataFetched( true );
			} catch ( err ) {
				console.error( 'Error fetching performance data:', err );
				setError( err.message );
			}
		};

		fetchData();
	}, [] );

	const calcPercent = useCallback( ( base, comp ) => {
		return Math.round( ( comp / base - 1 ) * 100 * 100 ) / 100;
	}, [] );

	const prettyTitle = useCallback( title => {
		return title.replace( /([a-z0-9])([A-Z])/g, '$1 $2' ).toUpperCase();
	}, [] );

	const chartData = useMemo( () => {
		if ( ! isDataFetched || rawData.length === 0 ) {
			return {};
		}

		const result = {};
		const availableMetrics = Object.keys( rawData[ rawData.length - 1 ].baseAvg );

		rawData.forEach( obj => {
			availableMetrics.forEach( metric => {
				if ( ! result[ metric ] ) {
					result[ metric ] = [];
				}
				let date = new Date( obj.date );
				date = date.toISOString().split( 'T' )[ 0 ];
				result[ metric ].push( {
					base: obj.baseAvg[ metric ],
					jetpack: obj.jetpackAvg[ metric ],
					date,
				} );
			} );
		} );

		const out = {};

		availableMetrics.forEach( metric => {
			const dates = [ ...new Set( result[ metric ].map( entry => entry.date ) ) ];
			const entries = dates.reduce( ( acc, date ) => {
				const byDate = result[ metric ].filter( e => e.date === date );

				acc.push( {
					base: Math.round( byDate.reduce( ( a, e ) => ( a += e.base ), 0 ) / byDate.length ),
					jetpack: Math.round( byDate.reduce( ( a, e ) => ( a += e.jetpack ), 0 ) / byDate.length ),
					date,
				} );

				return acc;
			}, [] );

			out[ metric ] = entries;
		} );

		return out;
	}, [ rawData, isDataFetched ] );

	const renderChart = useCallback(
		( type, chartDataForType ) => {
			const chartOptions = {
				grid: {
					left: 60,
					right: 0,
				},
				title: {
					text: prettyTitle( type ),
					textStyle: {
						color: '#cccccc',
						fontSize: '0.9rem',
					},
				},
				tooltip: {
					trigger: 'axis',
					axisPointer: {
						type: 'cross',
					},
				},
				xAxis: [
					{
						type: 'category',
						data: chartDataForType.map( function ( e ) {
							return e.date;
						} ),
					},
				],
				yAxis: [
					{
						type: 'value',
						splitLine: {
							lineStyle: {
								type: 'dotted',
								color: '#6b6d76',
							},
						},
					},
					{
						type: 'value',
						splitLine: {
							lineStyle: {
								type: 'dashed',
								color: 'rgba(107,109,118,0.47)',
							},
						},
						min: 0,
						axisLabel: {
							formatter: '{value} %',
						},
					},
				],
				dataZoom: [
					{
						type: 'inside',
					},
					{
						start: 50,
						end: 100,
					},
				],
				series: [
					{
						name: 'base',
						type: 'line',
						emphasis: {
							focus: 'series',
						},
						color: 'rgb(99,100,138)',
						data: chartDataForType.map( function ( e ) {
							return e.base;
						} ),
					},
					{
						name: 'jetpack',
						type: 'line',
						emphasis: {
							focus: 'series',
						},
						color: 'rgb(99,150,138)',
						data: chartDataForType.map( function ( e ) {
							return e.jetpack;
						} ),
					},
				],
			};

			return <ReactEcharts option={ chartOptions } style={ { height: '400px', width: '100%' } } />;
		},
		[ prettyTitle ]
	);

	const onSelect = useCallback( type => {
		setSelected( type );
	}, [] );

	const renderTypeInfo = useCallback(
		( type, last, prev ) => {
			const diffPercent = calcPercent( prev, last );

			return (
				<Row style={ { justifyContent: 'space-between' } }>
					<div style={ { display: 'flex' } }>
						<h5>
							{ type }: { last } ms.
						</h5>
						&nbsp;from: { prev }ms.
					</div>
					<span>&nbsp;VS previous: { diffPercent }ms.</span>
				</Row>
			);
		},
		[ calcPercent ]
	);

	const renderContainer = useCallback(
		( type, data ) => {
			const last = data.at( -1 );
			const prev = data.at( -2 );

			return (
				<Container
					className="perf-button"
					onClick={ () => onSelect( type ) }
					onKeyDown={ e => {
						if ( e.key === 'Enter' || e.key === ' ' ) {
							e.preventDefault();
							onSelect( type );
						}
					} }
					tabIndex={ 0 }
					role="button"
					aria-label={ `View ${ prettyTitle( type ) } performance metrics${
						selected === type ? ' (currently selected)' : ''
					}` }
					aria-pressed={ selected === type }
				>
					<Row>
						<h4>{ selected === type ? <u>{ prettyTitle( type ) }</u> : prettyTitle( type ) }</h4>
					</Row>
					<Row>&nbsp;</Row>
					{ renderTypeInfo( 'Base', last.base, prev.base ) }
					{ renderTypeInfo( 'Jetpack', last.jetpack, prev.jetpack ) }
				</Container>
			);
		},
		[ selected, onSelect, prettyTitle, renderTypeInfo ]
	);

	const renderButtons = useCallback(
		chartDataObj => {
			return (
				<Container fluid>
					<Row>
						<Col sm>{ renderContainer( 'type', chartDataObj.type ) }</Col>
						<Col sm>{ renderContainer( 'loaded', chartDataObj.loaded ) }</Col>
						<Col sm>{ renderContainer( 'focus', chartDataObj.focus ) }</Col>
					</Row>
					<Row>
						<Col sm>{ renderContainer( 'inserterOpen', chartDataObj.inserterOpen ) }</Col>
						<Col sm>{ renderContainer( 'inserterHover', chartDataObj.inserterHover ) }</Col>
						<Col sm>{ renderContainer( 'inserterSearch', chartDataObj.inserterSearch ) }</Col>
					</Row>
				</Container>
			);
		},
		[ renderContainer ]
	);

	if ( error ) {
		return (
			<div className="alert alert-danger">
				<h4>Error loading performance data</h4>
				<p>{ error }</p>
			</div>
		);
	}

	if ( ! isDataFetched ) {
		return (
			<div className="d-flex justify-content-center" role="status" aria-live="polite">
				<div className="spinner-border" role="status" aria-label="Loading performance data">
					<span className="visually-hidden">Loading performance data...</span>
				</div>
			</div>
		);
	}

	const type = selected;
	return (
		<div>
			<h4>Editor Performance Metrics</h4>
			<p>
				This examines block editor performance with and without Jetpack using the Gutenberg
				performance tests.
			</p>
			{ renderButtons( chartData ) }
			{ renderChart( type, chartData[ type ] ) }
		</div>
	);
}
