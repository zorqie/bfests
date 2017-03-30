import React from 'react'
import moment from 'moment'
import {browserHistory} from 'react-router'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import {Tabs, Tab} from 'material-ui/Tabs'

import GigDetailsPage from './gig-details-page.jsx'
import GigListItem from './gig-list-item.jsx'
import GigTimespan from './gig-timespan.jsx'
import EventActions from './event-actions.jsx'
import app from '../main.jsx'
import { gigJoin, gigLeave } from './utils.jsx'
import { plusOutline, minusBox } from './icons.jsx'


export default class EventPage extends React.Component {
	state = {
		event: {},
		pass: {},
		gigs: [], 
		tickets: {},
		allTickets: [],
		dialog: {
			open: false,
			gig: {},
		}
	}
	
	componentWillMount() {
		app.authenticate().then(this.fetchData)
		app.service('gigs').on('removed', this.gigRemoved)
		app.service('gigs').on('created', this.gigCreated)
		app.service('gigs').on('patched', this.fetchData) // just reload
		app.service('tickets').on('created', this.ticketCreated)
		app.service('tickets').on('removed', this.ticketRemoved)
	}
	componentWillUnmount() {
		if(app) {
			app.service('gigs').removeListener('removed', this.gigRemoved)
			app.service('gigs').removeListener('created', this.gigCreated)
			app.service('gigs').removeListener('patched', this.fetchData) 
			app.service('tickets').removeListener('removed', this.ticketRemoved)
			app.service('tickets').removeListener('created', this.ticketCreated)
		}
	}

	fetchData = () => {
		const eventId = this.props.params.eventId

		app.service('gigs').get(eventId)
		.then(event => {
			document.title = event.name
			app.emit('event.selected', event) 
			// app.service('tickets').find({query:{gig_id: event._id}})
			// .then(pass => {
			// 	if(access.indexOf(pass.status) <access.length-1) {

			// 	}
			// })
			app.service('gigs').find({
				query: {
					parent: eventId,
					type: {$ne: 'Volunteer'},
					$sort: { start: 1 },
					// $limit: this.props.limit || 7
				}
			})
			.then(page => {
				// console.log("Got result: ", page);			
				this.setState({gigs: page.data, event})
			})
		})
		.then(this.fetchTickets)
		.catch(err => console.error("ERAR: ", err))
	}

	fetchTickets = () => {
		app.service('tickets').find()
		.then(result => {
			console.log("Got tickets", result)
			if(result.total) {
				// store tickets as a Map of _id = ticket.status pairs
				const tickets = result.data.reduce((o, t) => Object.assign(o, {[t.gig_id]:t.status}), {})
				const {event} = this.state
				Object.assign(event, {tickets: result.data.filter(t=>t.gig_id===event._id)})
				this.setState({event, tickets, allTickets: result.data})
			}
		})
	}

	handleDialogCancel = e => {
		// console.log("Canceling...");
		this.setState({dialogOpen: false})
	}
	
	handleGigJoin = (gig, status) => {
		app.service('gigs').find({query: {parent: gig._id}})
		.then(result => {
			if(result.total) {
				// has children
				this.viewGigDetails(gig)
			} else {
				console.log("Go join the gig")
				gigJoin(gig, status)
			}
		})
	}

	isAttending = (gig, status) => {
		return this.state.tickets[gig._id] === status 
	}

	ticketCreated = t => {
		// console.log("Ticket created", t)
		const {tickets} = this.state
		Object.assign(tickets, {[t.gig_id]: t.status})
		this.setState({tickets})
	}
	ticketRemoved = t => {
		// console.log("Ticket removed", t)
		const {tickets} = this.state
		Object.assign(tickets, {[t.gig_id]: null})
		this.setState({tickets})
	}


	gigRemoved = gig => {
		this.setState({
			gigs: this.state.gigs.filter(g => g._id !== gig._id),
		})
	}
	gigCreated = gig => {
		this.setState({
			gigs: this.state.gigs.concat(gig),
		})
	}

	dialogClose = () => {
		this.setState({dialog: {open: false, gig:{}}})
	}

	viewGigDetails = gig => {
		 browserHistory.push('/gig/'+gig._id)
		// const { dialog } = this.state
		// Object.assign(dialog, {open: true, gig})
		// this.setState({dialog})
	}

	render() {
		const {event, dialog, tickets, allTickets} = this.state;
		const status = this.props.params.status || 'Attending'

		// console.log("GIGGGINGING: ", this.state);
		const title = <b>{event.name}</b>;

		const subtitle = <GigTimespan gig={event} showRelative={true}/>;

		return <Card>
			    <CardTitle 
			    	title={title} 
			    	subtitle={subtitle} 
			    />
			    <EventActions event={event} tickets={allTickets} route={this.props.route.path} />
				<CardText>
					{this.state.gigs.map(gig => 
						<GigListItem 
							key={gig._id} 
							gig={gig} 
							onSelect={this.viewGigDetails.bind(this, gig)}
							rightIconButton={this.isAttending(gig, status) 
								? <FlatButton 
									icon={minusBox}
									title="Leave" 
									onTouchTap={gigLeave.bind(null, gig, status)}
								/>
								: <FlatButton 
									icon={plusOutline}
									title="Join" 
									onTouchTap={this.handleGigJoin.bind(null, gig, status)}
								/>
							}
						/>
					)}
				</CardText>

				<Dialog 
					title={dialog.title}
					open={dialog.open} 
					autoScrollBodyContent={true}
					onRequestClose={this.dialogClose}
				>
					<GigDetailsPage 
						gig={dialog.gig} 
						onJoin={gigJoin} 
						onLeave={gigLeave}
						tickets={tickets}
						status={status}
					/>
				</Dialog>
			</Card>
		
	}
}