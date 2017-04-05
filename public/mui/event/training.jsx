import React from 'react'

import app from '../../main.jsx'
import EventActions from './actions.jsx'

export default class EventTrainingPage extends React.Component {
	state = {
		event: {}
	}
	componentWillMount() {
		const {eventId} = this.props.params
		app.service('gigs').get(eventId)
		.then(event => this.setState({ event }))
	}
	render() {
		const {event} = this.state
		const {tickets} = this.props
		return <div style={{margin:'2em'}} >
			<h2>{event.name} {event.venue && <span>at {event.venue.name}</span> || ''}</h2>
			<EventActions event={event} tickets={tickets} route={this.props.route.path} />
			<p>Here you will be able to view training videos related to your selected tasks. Eventually<br/>Maybe</p>
		</div>
	}
}