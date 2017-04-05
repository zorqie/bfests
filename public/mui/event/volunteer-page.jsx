import React from 'react'
import {Link, browserHistory} from 'react-router'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'

import app from '../../main.jsx'

import GigDetailsPage from '../gig-details-page.jsx'
import GigTimespan from '../gig-timespan.jsx'

import EventActions from './actions.jsx'

import { gigJoin, gigLeave } from '../utils.jsx'
import { plusOutline, minusBox } from '../icons.jsx'
import { Kspan } from '../hacks.jsx'

const checkTickets = (event, tickets) => {
	// here tickets are only Volunteering
	// TODO consider moving to EventActions
	const rules = event.ticket_rules
	const passes = tickets.filter(t => t.gig._id===event._id)
	if(rules) {
		const statuses = passes.map(t => t.status)
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
							const ticket = passes.find(t=> t.status===rule.status)
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

const isVolunteering = (gig, tickets) => tickets[gig._id] === "Volunteering" 

export default class EventPage extends React.Component {
	state = {
		loading: true,
		event: {},
		gigs: [], 

	}
	
	componentWillMount() {
		app.authenticate().then(this.fetchData)

		// TODO do we REALLY need these
		app.service('gigs').on('removed', this.gigRemoved);
		app.service('gigs').on('created', this.gigCreated);
		app.service('gigs').on('patched', this.gigPatched);
	}
	
	componentWillUnmount() {
		if(app) {
			app.service('gigs').removeListener('removed', this.gigRemoved);
			app.service('gigs').removeListener('created', this.gigCreated);
			app.service('gigs').removeListener('patched', this.gigPatched);
		}
	}

	fetchData = () => {
		const {eventId} = this.props.params;
		this.setState({loading: true})
		app.service('gigs').get(eventId)
		.then(event => {
			document.title = event.name;

			app.service('gigs').find({
				query: {
					parent: eventId,
					type: 'Volunteer',
					$sort: { start: 1 },
				}
			})
			.then(page => {
				// console.log("Got result: ", page);			
				this.setState({gigs: page.data, event, loading: false})
			})
		})
		.catch(err => console.error("ERAR: ", err))
	}

	

	handleGigJoin = gig => {
		app.service('gigs').find({query: {parent: gig._id}})
		.then(result => {
			if(result.total) {
				// has children
				this.viewGigDetails(gig)
			} else {
				console.log("Go volunteer!")
				gigJoin(gig, 'Volunteering')
			}
		})
	}
	
	viewGigDetails = gig => {
		browserHistory.push('/gig/'+gig._id)
		// const { dialog } = this.state
		// Object.assign(dialog, {open: true, gig})
		// this.setState({dialog})
	}


// TODO do we need these
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

	render() {
		const {loading, gig, dialog, event} = this.state
		const {tickets, ticketsByGig} = this.props
		// console.log("Volunteerizing: ", this.props)
		const title = <b>{event.name}</b>

		const subtitle = <GigTimespan gig={event} showRelative={true} />
		const n = tickets.filter(t=>t.gig.type==='Volunteer').length
		return (!loading && 
			<Card initiallyExpanded={true}>
			    {/*<CardHeader title={v.name} subtitle="gig" />*/}
			    <CardTitle 
					title={title} 
					subtitle={subtitle} 
			    />
			    <EventActions event={event} tickets={tickets} route={this.props.route.path}/>
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
								isVolunteering(gig, ticketsByGig) ?
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
			</Card>
		|| null)
	}
}