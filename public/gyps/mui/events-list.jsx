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
	overlay: {
		color:'white',
		margin: '1em'
	},
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
		app.service('gigs').find({query: {public: true}})
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
			if(tickets.total) {
				const events = this.state.events.map(e => Object.assign(e, {tickets: tickets.data.filter(t => e._id===t.gig_id)}))
				this.setState({events, tickets: tickets.data})
			}
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

	updatePass = (event, status, update) => {
		app.authenticate()
		.then(() => {
			if(update) {
				
			} else {
				// insert
				gigJoin(event, status)
			}
		})
		.catch(err => browserHistory.push('/gyps/eventinfo/'+event._id))
	}

// TODO  consider moving this to server side
	actions = event => {
		const {tickets} = this.state
		let result = []
		if(event.tickets && event.tickets.length) {
			//at least one ticket
			event.tickets.forEach(pass => {
				const rules = event.ticket_rules.filter(r => r.status===pass.status)
				rules.forEach(({requires, actions}) => {
					if(Array.isArray(requires)) {
						// 
						console.log("HURRAY, ARRAY", requires)
					} else if( typeof requires === 'object') {
						//object
						const {status, minCount, maxCount} = requires
						const matched = tickets.filter(t => t.status===status)
						if(matched.length >= minCount) {
							result = result.concat(actions)
						}
					} else {
						// no requires or something weird
						result = result.concat(actions)
					}
				})
				console.log("RULEZ!", rules)
			})
		} else {
			const only = event.ticket_rules.find(r => r.status===null)
			result = result.concat(only.actions)
			console.log("only", only)
		}
		// console.log("Resulting in ", result)
		return result
	}

	buttons = (event, actions) => {
		return actions && actions.map(({name, path, newStatus}) => {
			return name && (path ? 
				<Link key={event._id + name} to={'/gyps'+path.replace(':eventId', event._id)}><RaisedButton  label={name} /></Link> : 
				<RaisedButton key={event._id + name} primary={true} label={name} onTouchTap={this.updatePass.bind(this, event, newStatus)} />
			)
		})
	}

	render() {
		const {events, tickets} = this.state
		console.log("E-vents", events)
		console.log("teekettes", tickets)
		return <div>
			{events.map(event => 
				<Card key={event._id} style={styles.card} initiallyExpanded={true} >
				    <CardTitle 
				    	title={<span><b>{event.name}</b><FlatButton style={styles.titleRight} label='View details' onTouchTap={this.select.bind(this, event)} /></span>} 
				    	subtitle={<GigTimespan gig={event} showRelative={true}/>} 
				    	actAsExpander={true}
				    >
				    
				    </CardTitle>
				    <CardMedia 
				    	expandable={true}
				    >
						<img src={`/img/${event._id}_poster.jpg`} />
					</CardMedia>
					<CardText actAsExpander={true}>
						<p>{event.description}</p>
					</CardText>
					
					<CardActions>
						<EventActions event={event} tickets={tickets} />
						{/*this.buttons(event, this.actions(event))*/}
						
						{/*<FlatButton 
													label="Get tickets" 
													secondary={true}
													onTouchTap={this.updatePass.bind(this, event, null, status)}
												/>*/}
					</CardActions>
				</Card>
			)}
		</div>
	}
}