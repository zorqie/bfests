import React from 'react'
import moment from 'moment'
import mongoose from 'mongoose'
import {browserHistory} from 'react-router'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import {Tabs, Tab} from 'material-ui/Tabs'

import GigDetailsPage from './gig-details-page.jsx'
import GigTimespan from './gig-timespan.jsx'
import EventActions from './event-actions.jsx'
import app from '../main.jsx'
import { gigJoin, gigLeave } from './utils.jsx'
import { plusOutline, minusBox } from './icons.jsx'

// TODO move this
const access = [
	'Registered',
	'Paid',
	'Volnteered',
	'Trained',
	'Attending',
]

//hack because Material-UI forces a onKeyboardFocus onto the span and React complains
const Kspan = ({onKeyboardFocus, ...others}) => <span {...others}/>; 

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
		app.service('gigs').on('patched', this.gigPatched)
		app.service('tickets').on('created', this.ticketCreated)
		app.service('tickets').on('removed', this.ticketRemoved)
	}
	componentWillUnmount() {
		if(app) {
			app.service('gigs').removeListener('removed', this.gigRemoved)
			app.service('gigs').removeListener('created', this.gigCreated)
			app.service('gigs').removeListener('patched', this.gigPatched)
			app.service('tickets').removeListener('removed', this.ticketRemoved)
			app.service('tickets').removeListener('created', this.ticketCreated)
		}
	}

	fetchData = () => {
		const eventId = this.props.params.eventId

		app.service('gigs').get(eventId)
		.then(event => {
			document.title = event.name
			// app.service('tickets').find({query:{gig_id: event._id}})
			// .then(pass => {
			// 	if(access.indexOf(pass.status) <access.length-1) {

			// 	}
			// })
			app.service('gigs').find({
				query: {
					parent: new mongoose.Types.ObjectId(eventId),
					type: {$ne: 'Volunteer'},
					$sort: { start: 1 },
					// $limit: this.props.limit || 7
				}
			})
			.then(page => {
				// console.log("Got result: ", page);			
				this.setState({...this.state, gigs: page.data, event})
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
				const tickets = result.data.reduce((o, t) => Object.assign(o, {[t.gig_id]:t.status}), {})
				const {event} = this.state
				Object.assign(event, {tickets: result.data.filter(t=>t.gig_id===event._id)})
				this.setState({...this.state, event, tickets, allTickets: result.data})
			}
		})
	}

	handleDialogCancel = e => {
		// console.log("Canceling...");
		this.setState({dialogOpen: false})
	}
	
	isAttending = gig => {
		return this.state.tickets[gig._id] === "Attending" 
	}

	ticketCreated = t => {
		console.log("Ticket created", t)
		const {tickets} = this.state
		Object.assign(tickets, {[t.gig_id]: t.status})
		this.setState({...this.state, tickets})
	}
	ticketRemoved = t => {
		console.log("Ticket removed", t)
		const {tickets} = this.state
		Object.assign(tickets, {[t.gig_id]: null})
		this.setState({...this.state, ticket: tickets})
	}


	gigRemoved = gig => {
		// console.log("Removed: ", gig);
		this.setState({
			...this.state, 
			gigs: this.state.gigs.filter(g => g._id !== gig._id),
		})
	}
	gigCreated = gig => {
		// console.log("Added: ", gig);
		this.setState({
			...this.state, 
			gigs: this.state.gigs.concat(gig),
		})
	}
	gigPatched = gig => {
		// console.log("Updated: ", gig);
		// do something to reflect update
		this.fetchData()
	}

	dialogClose = () => {
		this.setState({...this.state, dialog:{open:false, gig:{}}})
	}

	viewGigDetails = gig => {
		// browserHistory.push('/gyps/gig/'+gig._id)
		const { dialog } = this.state
		Object.assign(dialog, {open: true, gig})
		this.setState({...this.state, dialog})
	}

	render() {
		const {event, dialog, tickets, allTickets} = this.state;
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
					{this.state.gigs.map(
						gig => <ListItem 
									key={gig._id} 
									primaryText={gig.name} 
									onTouchTap={this.viewGigDetails.bind(this, gig)}
									secondaryText={<GigTimespan gig={gig} />} 
									rightIconButton={
										this.isAttending(gig) ?
										<FlatButton 
											icon={minusBox}
											title="Leave" 
											onTouchTap={gigLeave.bind(null, gig, 'Attending')}
										/>
										:
										<FlatButton 
											icon={plusOutline}
											title="Join" 
											onTouchTap={gigJoin.bind(null, gig, 'Attending')}
										/>
									}
					/>)}
				</CardText>

				<Dialog title={dialog.title} open={dialog.open} onRequestClose={this.dialogClose} >
					<GigDetailsPage 
						gig={dialog.gig} 
						onJoin={gigJoin} 
						onLeave={gigLeave}
						tickets={tickets}
						status="Attending"
					/>
				</Dialog>
			</Card>
		
	}
}