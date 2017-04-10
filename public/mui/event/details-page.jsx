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

import { gigJoin, gigLeave, viewGig } from '../utils.jsx'
import { plusOutline, minusBox } from '../icons.jsx'
import { Kspan } from '../hacks.jsx'

const isAttending = (gig, tickets, status) => 
	tickets && tickets.find(t => 
		t.status === status
		&& (t.gig._id === gig._id || t.gig.parent===gig._id)
	)

const handleGigJoin = (gig, status) => {
	app.service('gigs').find({query: {parent: gig._id}})
	.then(result => {
		if(result.total) {
			// has children
			viewGig(gig)
		} else {
			// console.log("Go join the gig")
			gigJoin(gig, status)
		}
	})
}

const handleGigLeave = (gig, status) => {
	app.service('gigs').find({query: {parent: gig._id}})
	.then(result => {
		if(result.total) {
			// has children
			viewGig(gig)
		} else {
			// console.log("Go join the gig")
			gigLeave(gig, status)
		}
	})
}


export default class EventPage extends React.Component {
	state = {
		event: {},
		gigs: [], 
	}
	
	componentDidMount() {
		app.authenticate().then(() => this.fetchData()) // if we don't use ()=> then we pass result of auth to fetch. not cool
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

	fetchData = patched => {
		if(patched && patched.parent===this.state.event._id) {
			console.log("Fetch", patched)
			const gigs = this.state.gigs.map(g => g._id===patched._id ? patched: g)
			this.setState({gigs})
		} else {
			const { eventId, type } = this.props.params
			console.log("Fetching...")

			app.service('gigs').get(eventId)
			.then(event => {
				document.title = event.name
				// app.emit('event.selected', event) 
				this.setState({event})
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
					this.setState({gigs: page.data})
				})
			})
			// .then(this.fetchTickets)
			.catch(err => console.error("ERAR: ", err))
		}
	}

	
	gigRemoved = gig => {
		if(gig.parent===this.state.event._id) {
			this.setState({
				gigs: this.state.gigs.filter(g => g._id !== gig._id),
			})
		}
	}
	gigCreated = gig => {
		if(gig.parent===this.state.event._id) {
			this.setState({
				gigs: this.state.gigs.concat(gig),
			})
		}
	}

	render() {
		const {event, gigs} = this.state
		const {tickets} = this.props
		const status = this.props.params.type === 'Volunteer' ? 'Volunteering' : 'Attending' // TODO this is meaningless

		// console.log("GIGGGINGING: ", tickets);
		const title = <b>{event.name}</b>;

		const subtitle = <GigTimespan gig={event} showRelative={true}/>;

		return event._id && <Card>
			    <CardTitle 
			    	title={title} 
			    	subtitle={subtitle} 
			    />
			    <EventActions event={event} tickets={tickets} route={this.props.route.path} />
				{gigs.length 
					&& <CardText>
						{gigs.map(gig => 
							<GigListItem 
								key={gig._id} 
								gig={gig} 
								onSelect={viewGig.bind(this, gig)}
								rightIconButton={isAttending(gig, tickets, status) 
									? <FlatButton 
										icon={minusBox}
										title="Leave" 
										onTouchTap={handleGigLeave.bind(null, gig, status)}
									/>
									: <FlatButton 
										icon={plusOutline}
										title="Join" 
										onTouchTap={handleGigJoin.bind(null, gig, status)}
									/>
								}
							/>
						)}
					</CardText>
				|| <CircularProgress />}
			</Card>
			|| null
	}
}