import React from 'react'

import app from '../main.jsx'
import deny from './err'
import EventActions from './event-actions.jsx'

export default class EventPurchasePage extends React.Component {
	state={
		event: {},
		tickets: [],
	}
	componentWillMount() {
		const {eventId} = this.props.params
		app.service('gigs').get(eventId)
		.then(event => {
			app.service('tickets').find()
			.then(result => {
				Object.assign(event, {tickets: result.data.filter(t => t.gig_id === event._id)})
				this.setState({event, tickets: result.data})
			}).catch(deny)
		})
		.catch(deny)
	}
	render() {
		const {event, tickets} = this.state
		return tickets.length 
			&& <div style={{margin:'2em'}} >
					<h2>{event.name} {event.venue && <span>at {event.venue.name}</span> || ''}</h2>
					<EventActions event={event} tickets={tickets} route={this.props.route.path} />
					This is where you will be able to purchase passes. Eventually<br/>Maybe
				</div>
			|| (event._id && <div style={{margin:'2em'}} >Nothing to see here.</div>)
			|| null
	}
}