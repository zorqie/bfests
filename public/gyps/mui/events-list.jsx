import React from 'react'
import { Link, browserHistory } from 'react-router'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import { List, ListItem } from 'material-ui/List'

import GigTimespan from './gig-timespan.jsx'
import EventActions from './event-actions.jsx'
import app from '../main.jsx'
import { gigJoin } from './utils.jsx'

const styles = {
	card: {
		margin: '2em'
	},
	titleRight: {
		float: 'right'
	}
}

export default class EventsList extends React.Component {
	state = {
		events: [],
		tickets: [],
	}
	componentWillMount() {
		app.service('gigs').find({query: {public: true, $sort:{start:1}}})
		.then(gigs => this.setState({events: gigs.data}))
		.catch(err => console.error)
	}
	componentDidMount() {
		this.fetchTickets()
		app.service('tickets').on('created', this.ticketListener)
		app.service('tickets').on('patched', this.ticketListener)
		app.service('tickets').on('removed', this.ticketListener)
	} 
	componentWillUnmount() {
		app.service('tickets').removeListener('created', this.ticketListener)
		app.service('tickets').removeListener('patched', this.ticketListener)
		app.service('tickets').removeListener('removed', this.ticketListener)
	}

	fetchTickets() {
		app.service('tickets').find() 
		.then(tickets => {
			// TODO consider moving this to server side
			
				const events = this.state.events.map(e => Object.assign(e, {tickets: tickets.data.filter(t => e._id===t.gig_id)}))
				this.setState({events, tickets: tickets.data})
			
		})
		.catch(err => console.error)
	}

	ticketListener = ticket => {
		this.fetchTickets()
	}

	select = e => {
		if(app.get('user')) {
			browserHistory.push('/gyps/events/'+e._id)
		} else {
			browserHistory.push('/gyps/eventinfo/'+e._id)
		}
	}

	render() {
		const {events, tickets} = this.state
		// console.log("E-vents", events)
		// console.log("teekettes", tickets)
		return <div>
			{events.map(event => 
				<Card key={event._id} style={styles.card} initiallyExpanded={true} >
				    <CardTitle 
				    	title={<span><b>{event.name}</b><FlatButton style={styles.titleRight} label='View details' onTouchTap={this.select.bind(this, event)} /></span>} 
				    	subtitle={<GigTimespan gig={event} showRelative={true}/>} 
				    	actAsExpander={true}
				    >
				    
				    </CardTitle>
				    <CardMedia expandable={true} >
						<img src={`/img/${event._id}_poster.jpg`} />
					</CardMedia>
					<CardText actAsExpander={true}>
						<p>{event.description}</p>
					</CardText>
										
					<EventActions event={event} tickets={tickets} />
					
				</Card>
			)}
		</div>
	}
}