import React from 'react'
import {browserHistory} from 'react-router'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import CircularProgress from 'material-ui/CircularProgress'
import {List, ListItem} from 'material-ui/List'

import app from '../../main.jsx'

import GigDetailsPage from '../gig-details-page.jsx'
import GigListItem from '../gig-list-item.jsx'
import GigTimespan from '../gig-timespan.jsx'

import EventActions from './actions.jsx'

import { gigJoin, gigLeave } from '../utils.jsx'
import { plusOutline, minusBox } from '../icons.jsx'


export default class EventPage extends React.Component {
	state = {
		event: {},
		gigs: [], 
	}
	
	componentWillMount() {
		app.authenticate().then(this.fetchData)
		app.service('gigs').on('removed', this.gigRemoved)
		app.service('gigs').on('created', this.gigCreated)
		app.service('gigs').on('patched', this.fetchData) // just reload
	}
	componentWillUnmount() {
		if(app) {
			app.service('gigs').removeListener('removed', this.gigRemoved)
			app.service('gigs').removeListener('created', this.gigCreated)
			app.service('gigs').removeListener('patched', this.fetchData) 
		}
	}

	fetchData = () => {
		const { eventId, type } = this.props.params

		app.service('gigs').get(eventId)
		.then(event => {
			document.title = event.name
			app.emit('event.selected', event) 
			app.service('gigs').find({
				query: {
					parent: eventId,
					type: type || {$ne: 'Volunteer'},
					$sort: { start: 1 },
					// $limit: this.props.limit || 7
				}
			})
			.then(page => {
				// console.log("Got result: ", page)	
				this.setState({gigs: page.data, event})
			})
		})
		// .then(this.fetchTickets)
		.catch(err => console.error("ERAR: ", err))
	}

	
	handleGigJoin = (gig, status) => {
		app.service('gigs').find({query: {parent: gig._id}})
		.then(result => {
			if(result.total) {
				// has children
				this.viewGigDetails(gig)
			} else {
				// console.log("Go join the gig")
				gigJoin(gig, status)
			}
		})
	}

	handleGigLeave = (gig, status) => {
		app.service('gigs').find({query: {parent: gig._id}})
		.then(result => {
			if(result.total) {
				// has children
				this.viewGigDetails(gig)
			} else {
				// console.log("Go join the gig")
				gigLeave(gig, status)
			}
		})
	}

	isAttending = (gig, ticketsByGig, status, tickets) => {
		const all = ticketsByGig[gig._id] === status 
		const some = tickets && tickets.reduce((acc, t) => {
			if(t.gig.parent===gig._id) {
				const any = ticketsByGig[t.gig._id] === status
				return acc + any
			}
			return acc			
		}, 0)
		// console.log("SOME::::::::::::: ", some)
		return all || some
	}
	
	gigRemoved = gig => 
		this.setState({
			gigs: this.state.gigs.filter(g => g._id !== gig._id),
		})

	gigCreated = gig => 
		this.setState({
			gigs: this.state.gigs.concat(gig),
		})
		
	viewGigDetails = gig =>  browserHistory.push('/gig/'+gig._id)

	render() {
		const {event, gigs} = this.state
		const {tickets, ticketsByGig} = this.props
		const status = this.props.params.status || 'Attending' // TODO this is meaningless

		// console.log("GIGGGINGING: ", tickets);
		const title = <b>{event.name}</b>;

		const subtitle = <GigTimespan gig={event} showRelative={true}/>;

		return gigs.length && <Card>
			    <CardTitle 
			    	title={title} 
			    	subtitle={subtitle} 
			    />
			    <EventActions event={event} tickets={tickets} route={this.props.route.path} />
				<CardText>
					{gigs.map(gig => 
						<GigListItem 
							key={gig._id} 
							gig={gig} 
							onSelect={this.viewGigDetails.bind(this, gig)}
							rightIconButton={this.isAttending(gig, ticketsByGig, status, tickets) 
								? <FlatButton 
									icon={minusBox}
									title="Leave" 
									onTouchTap={this.handleGigLeave.bind(null, gig, status)}
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
			</Card>
			|| <CircularProgress />
	}
}