import React from 'react'
import { Link, browserHistory } from 'react-router'

const defaultInfo = 
	<div style={{padding:'1em'}}>
		<h2 style={{margin:'1em 0'}}>Welcome</h2>
		<p>You have found the rabbit hole.</p>
		<p>In order to enter you must first <Link to='/signup'>create a profile</Link> or if you have been inside already, <Link to='/login'>sign in</Link> to continue.</p>
	</div>

function EventInfo({event, tickets}) {
	// tickets is all user's tickets
	const {info} = event
	event.tickets && event.tickets.forEach(t => console.log("T: ", t))
	const text = info && event.tickets && event.tickets.map(t => info.filter(i => i.status===t.status).map(i => i.text))
	return text && <div style={{padding:'1em'}}>{text.map((t, i) => <p key={i}>{t}</p>)}</div> || defaultInfo
}

export default EventInfo