import moment from 'moment';

export function calculateMaxDays( oldestTimestamp ) {
	if ( ! oldestTimestamp ) {
		return null;
	}
	const daysDiff = moment().diff( moment( oldestTimestamp ), 'days' );
	return daysDiff > 0 ? daysDiff : null;
}
