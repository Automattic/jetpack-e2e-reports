import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faCodeBranch, faQuestion, faTimes } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment';
import configData from '../config.json';

const ReportRow = ({ report, id }) => {
	const { statistic, metadata, history } = report;
	const isFailed = statistic.total !== statistic.passed + statistic.skipped;

	const getReportLinkCell = (reportData, metadataData, isFailedData, totalTests) => {
		const linkUrl = `${ configData.dataSourceURL }/reports/${ reportData.name }/report/index.html`;

		const reportKey = reportData.name;
		let reportTitle = reportData.name;

		if ( metadataData.pr_title ) {
			const prNumber = `(#${ metadataData.pr_number })`;
			reportTitle = `${ metadataData.pr_title } ${ prNumber }`;
		}

		const branchUrl = `https://github.com/${ metadataData.repository }/tree/${ metadataData.branch }`;
		const prUrl = `https://github.com/${ metadataData.repository }/pull/${ metadataData.pr_number }`;

		let statusIcon = faQuestion;
		let statusClassName = 'warning';
		if ( totalTests > 0 ) {
			statusIcon = isFailedData ? faTimes : faCheck;
			statusClassName = isFailedData ? 'failed' : 'passed';
		}

		return (
			<ul className={ 'list-unstyled' }>
				<li>
					<FontAwesomeIcon className={ statusClassName } icon={ statusIcon } />
					&nbsp;
					<a href={ linkUrl } className="report-link" target="_blank" rel="noreferrer">
						{ reportTitle }
						<br />
					</a>
				</li>
				<li>
					<small>
						#{ reportKey } { ' • ' }
						<FontAwesomeIcon icon={ faCodeBranch } />{ ' ' }
						<a href={ branchUrl } target={ '_blank' } className={ 'report-link' } rel="noreferrer">
							{ metadataData.branch }
						</a>
						{ metadataData.pr_number ? ' • ' : '' }
						{ metadataData.pr_number && (
							<a
								href={ prUrl }
								target={ '_blank' }
								className={ 'report-link' }
								rel={ 'noreferrer' }
							>
								PR { metadataData.pr_number }
							</a>
						) }
					</small>
				</li>
			</ul>
		);
	};

	const getTestResultsCell = (statisticData) => {
		const counts = [ 'failed', 'passed', 'total' ].map( ( label, index ) => {
			const count = label === 'failed' ? statisticData[ label ] + statisticData.broken : statisticData[ label ];
			return (
				<span key={ index } className={ `label label-status-${ label }` }>
					{ label } { count }
				</span>
			);
		} );

		return <div>{ counts }</div>;
	};

	const getTestResultsHistoryCell = (historyData) => {
		const formattedHistory = historyData
			.slice( -10 )
			.split( '' )
			.map( ( item, index ) => {
				const statusClass = item === 'F' ? 'failed' : 'passed';
				return (
					<span key={ index } className={ `label label-status-${ statusClass }` }>
						{ item }
					</span>
				);
			} );
		return <div>{ formattedHistory }</div>;
	};

	const getMetadataCell = (reportData) => {
		const runUrl = `https://github.com/Automattic/jetpack/actions/runs/${ reportData.metadata.run_id }`;
		return (
			<ul className={ 'list-unstyled' }>
				<li>
					<small>last update: { moment( reportData.lastUpdate ).fromNow() }</small>
				</li>
				<li>
					<small>
						last run id:{ ' ' }
						<a href={ runUrl } target={ '_blank' } className={ 'report-link' } rel="noreferrer">
							{ reportData.metadata.run_id }
						</a>
					</small>
				</li>
			</ul>
		);
	};
	
	return (
		<tr key={ id }>
			<td className={ 'reportNameCell' }>
				{ getReportLinkCell( report, metadata, isFailed, statistic.total ) }
			</td>
			<td>
				{ getTestResultsCell( statistic ) } { getTestResultsHistoryCell( history ) }
			</td>
			<td>{ getMetadataCell( report ) }</td>
		</tr>
	);
};

export default ReportRow;