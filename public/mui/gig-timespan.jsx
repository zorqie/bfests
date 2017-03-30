import React from 'react'
import moment from 'moment'

const GigTimespan = ({gig, showRelative, showDuration, hideDates, ...others}) => {
	const mNow = moment();
	const mStart = moment(gig.start);
	const dateFormat = mNow.year() == mStart.year() ? 'ddd M/D' : 'ddd M/D/YY';
	const timeFormat = 'h:mm\u00A0a'
	const startDate = mStart.format(dateFormat);
	const endDate = gig.end && moment(gig.end).format(dateFormat);
	const relative = showRelative 
		? <span className='gig-relative'>{'(' + moment().to(mStart) + ')'}</span> 
		: ''

	const duration = (showDuration && gig.end) 
		? <span className='gig-duration'>{moment.duration(moment(gig.end).diff(mStart)).humanize()}</span> 
		: ''
	// {...others} passes the styling on
	return <span className='gig-timespan' {...others}>
			<span className='gig-start'>{!hideDates && <span>{startDate} at</span>} {mStart.format(timeFormat)}</span>
			{endDate && <span className='gig-dash'>{' \u2013 '}</span>}
			{endDate && (<span className='gig-end'>{endDate===startDate ? '' : endDate + ' at\u00A0'}{moment(gig.end).format(timeFormat)}</span>)}
			{' '}
			{relative}
			{' '}
			{duration}
		</span>
}

export default GigTimespan