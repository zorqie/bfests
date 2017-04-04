import React from 'react'

import qr from 'qr-image'

import app from '../main.jsx'

export default function Passes({params}) {
	const text = "https://gyps.herokuapp.com/checkqr/" + params.eventId + '/3/' + app.get('user')._id
	return <div>
		<h2>This is a test. Do not attempt to board a plane with this</h2>

		<div dangerouslySetInnerHTML={{__html: qr.imageSync(text, {type: 'svg'})}} />
	</div>
}