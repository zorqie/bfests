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
import app from '../main.jsx'
import { gigJoin, gigLeave } from './utils.jsx'
import { plusOutline, minusBox } from './icons.jsx'
import { Kspan } from './hacks.jsx'

export default class EventPage extends React.Component {
	state = {
		event: {},
		pass: {},
		gigs: [], 
		tickets: {},
		ticketsRaw: [],
		dialog: {
			open: false,
			gig: {},
		},
	}
	
	componentWillMount() {
		app.authenticate().then(this.fetchData)
		app.service('gigs').on('removed', this.gigRemoved);
		app.service('gigs').on('created', this.gigCreated);
		app.service('gigs').on('patched', this.gigPatched);
		app.service('tickets').on('created', this.ticketCreated);
		app.service('tickets').on('removed', this.ticketRemoved);
	}
	componentDidMount() {
		app.service('tickets').find({query:{status:"Volunteering"}})
		.then(result => {
			// console.log("Got tickets", result)
			const tickets = result.data.reduce((o, t) => Object.assign(o, {[t.gig_id]:t.status}), {})
			this.setState({...this.state, ticketsRaw: result.data, tickets})
		})
	}
	componentWillUnmount() {
		if(app) {
			app.service('gigs').removeListener('removed', this.gigRemoved);
			app.service('gigs').removeListener('created', this.gigCreated);
			app.service('gigs').removeListener('patched', this.gigPatched);
			app.service('tickets').removeListener('removed', this.ticketRemoved);
			app.service('tickets').removeListener('created', this.ticketCreated);
		}
	}

	fetchData = () => {
		const eventId = this.props.params.eventId;

		app.service('gigs').get(eventId)
		.then(event => {
			document.title = event.name;
			// app.service('tickets').find({query:{gig_id: event._id}})
			// .then(pass => {
			// 	if(access.indexOf(pass.status) <access.length-1) {

			// 	}
			// })
			app.service('gigs').find({
				query: {
					parent: new mongoose.Types.ObjectId(eventId),
					type: 'Volunteer',
					$sort: { start: 1 },
					// $limit: this.props.limit || 7
				}
			})
			.then(page => {
				// console.log("Got result: ", page);			
				this.setState({...this.state, gigs: page.data, event})
			})})
		.catch(err => console.error("ERAR: ", err))
	}

	handleDialogCancel = e => {
		// console.log("Canceling...");
		this.setState({dialogOpen: false})
	}

	isVolunteering = gig => {
		return this.state.tickets[gig._id] === "Volunteering" 
	}

	handleGigJoin = gig => {
		app.service('gigs').find({query: {parent: gig._id}})
		.then(result => {
			if(result.total) {
				// has children
				this.viewGigDetails(gig)
			} else {
				console.log("Go join the gig")
				gigJoin(gig, 'Volunteering')
			}
		})
	}
	
	shiftJoin = gig => {
		gigJoin(gig, 'Volunteering')
	}
	shiftLeave = gig => {
		gigLeave(gig, 'Volunteering')
	}

	viewGigDetails = gig => {
		// browserHistory.push('/gyps/gig/'+gig._id)
		const { dialog } = this.state
		Object.assign(dialog, {open: true, gig})
		this.setState({...this.state, dialog})
	}

	ticketCreated = t => {
		console.log("Ticket created", t)
		const {tickets} = this.state
		Object.assign(tickets, {[t.gig_id]: t.status})
		this.setState({...this.state, tickets, ticketsRaw: this.state.ticketsRaw.concat(t)})
	}
	ticketRemoved = t => {
		console.log("Ticket removed", t)
		const {tickets} = this.state
		Object.assign(tickets, {[t.gig_id]: null})
		this.setState({...this.state, tickets, ticketsRaw: this.state.ticketsRaw.filter(r=> r._id!==t._id)})
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


	render() {
		const {gig, dialog, event, tickets, ticketsRaw} = this.state;
		// console.log("GIGGGINGING: ", this.state);
		const title = <b>{event.name}</b>;

		const subtitle = <GigTimespan gig={event} showRelative={true}/>;

		return (
			<Card initiallyExpanded={true}>
			    {/*<CardHeader title={v.name} subtitle="gig" />*/}
			    <CardTitle 
					title={title} 
					subtitle={subtitle} 
			    />
				<CardText>
					{ticketsRaw.length ? 
						<p>You have volunteered for {ticketsRaw.length} opportunities. Feel free to select some more</p> :
						<p>Който не работи, не яде. За да не изхвърляме храна, запишете се да работите.</p>
					}
					{this.state.gigs.map(
						gig => <ListItem 
									key={gig._id} 
									primaryText={gig.name} 
									onTouchTap={this.viewGigDetails.bind(this, gig)}
									secondaryText={<GigTimespan gig={gig} />} 
									rightIconButton={
										this.isVolunteering(gig) ?
										<FlatButton 
											icon={minusBox}
											title="Leave" 
											onTouchTap={gigLeave.bind(this, gig, 'Volunteering')}
										/>
										:
										<FlatButton 
											icon={plusOutline}
											title="Join" 
											onTouchTap={this.handleGigJoin.bind(this, gig)}
										/>
									}
					/>)}
				</CardText>

				<Dialog title={dialog.title} open={dialog.open} onRequestClose={this.dialogClose} >
					<GigDetailsPage 
						gig={dialog.gig} 
						onJoin={this.shiftJoin} 
						onLeave={this.shiftLeave}
						tickets={tickets}
						status={tickets[dialog.gig._id]}
					/>
				</Dialog>
				<CardActions>					
				</CardActions>
			</Card>
		)
	}
}