import React from 'react'

import app from '../main.jsx'

const valid = (userId, ticketId, seqId) => true

export default class QrPage extends React.Component{
	render() {
		const {userId, ticketId, seqId} = this.props.params
		return <div className='qr-check'>
			{valid(userId, ticketId, seqId) 
				&& <div className='qr-valid'>Valid</div>
				|| <div className='qr-fail'>Fail</div>}
		</div>
	}
}