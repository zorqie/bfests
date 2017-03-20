import React from 'react'
import { Link, browserHistory } from 'react-router'

const EventInfo = (props) => <div style={{padding:'1em'}}>
	<h2 style={{margin:'1em 0'}}>Welcome</h2>
	<p>You have found the rabbit hole.</p>
	<p>In order to enter you must first <Link to='/signup'>create a profile</Link> or if you have been inside already, <Link to='/login'>sign in</Link> to continue.</p>
</div>

export default EventInfo