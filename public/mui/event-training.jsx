import React from 'react'

import app from '../main.jsx'
import EventActions from './event-actions.jsx'

export default class EventTrainingPage extends React.Component {
	state={
		event: {},
		tickets: []
	}
	componentWillMount() {
		const {eventId} = this.props.params
		app.service('gigs').get(eventId)
		.then(event => {
			app.service('tickets').find()
			.then(result => {
				Object.assign(event, {tickets: result.data.filter(t => t.gig_id === event._id)})
				this.setState({event, tickets: result.data})
			})
		})
	}
	render() {
		const {event, tickets} = this.state
		return <div style={{margin:'2em'}} >
			<h2>{event.name} {event.venue && <span>at {event.venue.name}</span> || ''}</h2>
			<EventActions event={event} tickets={tickets} route={this.props.route.path} />
			<p>Here you will be able to view training videos related to your selected tasks. Eventually<br/>Maybe</p>
		</div>
	}
}