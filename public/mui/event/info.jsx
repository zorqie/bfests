import React from 'react'
import { Link, browserHistory } from 'react-router'

import { unique } from '../hacks.jsx'

const defaultInfo = 
	<div style={{padding:'1em'}}>
		<h2 style={{margin:'1em 0'}}>Welcome</h2>
		<p>You have found the rabbit hole.</p>
		<p>In order to enter you must first <Link to='/signup'>create a profile</Link> or if you have been inside already, <Link to='/login'>sign in</Link> to continue.</p>
	</div>

function EventInfo({event, tickets}) {
	// tickets is all user's tickets
	const {info} = event
	const passes = tickets.filter(t => t.gig._id === event._id)
	const statuses = unique(passes.map(t => t.status))
	const text = info && statuses && statuses.map(s => info.filter(i => i.status===s).map(i => i.text))
	return text 
		&& <div style={{padding:'1em'}}>
			{text.map((t, i) => <p key={i}>{t}</p>)}
		</div> 
		|| defaultInfo
}

export default EventInfo