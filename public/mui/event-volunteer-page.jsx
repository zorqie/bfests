import React from 'react'
import {Link, browserHistory} from 'react-router'

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
import { Kspan } from './hacks.jsx'

const checkTickets = (event, tickets) => {
	// here tickets are only Volunteering
	// TODO consider moving to EventActions
	const rules = event.ticket_rules
	if(rules) {
		const statuses = event.tickets.map(t => t.status)
		// console.log("STATUSes", statuses)
		rules.forEach(rule => {
			if(rule.newStatus && rule.requires) {
				// rule has requirements and forces a change of status; ignore actions only rules
				if(statuses.indexOf(rule.status) > -1) {
					// console.log("RULE!", rule)
					// TODO use meets from event-actions!
					if(rule.requires.length) {
						console.log("ARRrgh! Array!", rule.requires)
					} else {
						const {minCount, status} = rule.requires 
						if (tickets.filter(t => t.status===status).length >= minCount) {
							console.log("Changing status to", rule.newStatus)
							const ticket = event.tickets.find(t=> t.status===rule.status)
							app.service('tickets').patch(ticket._id, {status: rule.newStatus})
						}
					}
				} else if(statuses.indexOf(rule.newStatus) > -1) {
					if(rule.requires.length) {
						console.log("Array! ARRrgh! ", rule.requires)
					} else {
						const {minCount, status} = rule.requires 
						console.log("Uh-oh", rule.requires)
						if (tickets.filter(t => t.status===status).length < minCount) {
							console.log("Achievment UNREQUIRED")
						}
					}
				}
			}
		})
	}
}


export default class EventPage extends React.Component {
	state = {
		loading: true,
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
		// this.fetchTickets()
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
		const {eventId} = this.props.params;
		this.setState({loading: true})
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
					parent: eventId,
					type: 'Volunteer',
					$sort: { start: 1 },
					// $limit: this.props.limit || 7
				}
			})
			.then(page => {
				// console.log("Got result: ", page);			
				this.setState({gigs: page.data, event, loading: false})
			})
		})
		.then(this.fetchTickets)
		.catch(err => console.error("ERAR: ", err))
	}
	fetchTickets = () => {
		app.service('tickets').find(/*{query:{status:"Volunteering"}}*/)
		.then(result => {
			// console.log("Got tickets", result)
			const tickets = result.data.reduce((o, t) => Object.assign(o, {[t.gig_id]:t.status}), {})
			const {event} = this.state
			console.log("Event", event)
			const passes = result.data.filter(t => t.gig_id===event._id)
			console.log("PASSED", passes)
			if(event && passes.length) {
				Object.assign(event, {tickets: passes})
			}
			this.setState({ticketsRaw: result.data.filter(t => t.status==='Volunteering'), event, tickets})
		})
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
		// browserHistory.push('/gig/'+gig._id)
		const { dialog } = this.state
		Object.assign(dialog, {open: true, gig})
		this.setState({dialog})
	}

	ticketCreated = t => {
		// console.log("Ticket created", t)
		const {event, tickets} = this.state
		Object.assign(tickets, {[t.gig_id]: t.status})
		const tix = this.state.ticketsRaw.concat(t)
		checkTickets(event, tix)
		this.setState({tickets, ticketsRaw: tix})
	}
	ticketRemoved = t => {
		// console.log("Ticket removed", t)
		const {event, tickets, ticketsRaw} = this.state
		Object.assign(tickets, {[t.gig_id]: null})
		const tix = this.state.ticketsRaw.filter(r=> r._id!==t._id)
		checkTickets(event, tix)
		this.setState({tickets, ticketsRaw: tix})
	}


	gigRemoved = gig => {
		// console.log("Removed: ", gig);
		this.setState({
			
			gigs: this.state.gigs.filter(g => g._id !== gig._id),
		})
	}
	gigCreated = gig => {
		// console.log("Added: ", gig);
		this.setState({
			
			gigs: this.state.gigs.concat(gig),
		})
	}
	gigPatched = gig => {
		// console.log("Updated: ", gig);
		// do something to reflect update
		this.fetchData()
	}

	dialogClose = () => {
		this.setState({dialog:{open:false, gig:{}}})
	}


	render() {
		const {loading, gig, dialog, event, tickets, ticketsRaw} = this.state
		// console.log("Volunteerizing: ", this.props)
		const title = <b>{event.name}</b>

		const subtitle = <GigTimespan gig={event} showRelative={true} />
		const n = ticketsRaw.length
		return (!loading && 
			<Card initiallyExpanded={true}>
			    {/*<CardHeader title={v.name} subtitle="gig" />*/}
			    <CardTitle 
					title={title} 
					subtitle={subtitle} 
			    />
			    <EventActions event={event} tickets={ticketsRaw} route={this.props.route.path}/>
				<CardText>
					{n > 0
						? <p>You have volunteered for <Link to='/tasks'>{n} opportunities</Link>. 
							{n<5 ? ' Feel free to select some more' : ' Give others a chance too'}
						</p>
						: <p>Whoever doesn't work, doesn't eat. To prevent food waste, please choose some work.</p>
					}
					{this.state.gigs.map(gig => 
						<ListItem 
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
						/>
					)}
				</CardText>

				<Dialog 
					title={dialog.title} 
					open={dialog.open} 
					onRequestClose={this.dialogClose} 
					autoScrollBodyContent={true}
				>
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
		|| null)
	}
}