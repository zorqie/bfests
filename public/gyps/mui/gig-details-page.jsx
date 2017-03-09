import React from 'react'
import moment from 'moment'
import mongoose from 'mongoose'
import { browserHistory } from 'react-router';

import Avatar from 'material-ui/Avatar'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import Dialog from 'material-ui/Dialog'

import ActsList from './acts-list.jsx'
import GigTimespan from './gig-timespan.jsx'
import app from '../main.jsx'
import { gigJoin, gigLeave } from './utils.jsx'

import PerformanceCard from './cards/performance-card.jsx'
import WorkshopCard from './cards/workshop-card.jsx'
import VolunteerCard from './cards/volunteer-card.jsx'

const styles = {
	leave: {
		margin: '1em',
		border: '2px solid grey'
	}
}

export default class GigDetailsPage extends React.Component {
	state = {
		fans: [],  
		gig: this.props.gig || {},
		venue: {},
		ticket: {},
	}

	componentWillMount() {
		app.authenticate().then(this.fetchData)
		.catch(err => console.error("It can't be, an erro: ", err))
	}

	componentDidMount() {
		// attach listeners
		app.service('tickets').on('created', this.ticketListener)
		app.service('tickets').on('removed', this.ticketListener)
		app.service('gigs').on('patched', this.fetchData)
	}

	componentWillUnmount() {
		// remove listners
		app.service('gigs').removeListener('patched', this.fetchData)
		app.service('tickets').removeListener('created', this.ticketListener)
		app.service('tickets').removeListener('removed', this.ticketListener)
	}

	ticketListener = t => {
		// console.log("HEARD a ticket", t)
		// console.log("Our tic", this.state.ticket)
		// our ticket may be null
		// no need to check owner_id, it's hooked on service
		t.gig_id===this.state.gig._id && this.fetchData()
	}

	fetchData = () => {
		if(this.props.params) {
			// if not inside another page
			const {gigId} = this.props.params
			// console.log("Fetching ", gigId)
			app.service('gigs').get(gigId)
			.then(gig => {
					this.fetchTickets(gig)
				}
			)
		} else {
			// already have our gig in props
			this.fetchTickets(this.props.gig)
		}
		// not authorized
		// .then(() => app.service('fans')
		// 	.find({query:{gig_id:gigId, status: 'Attending'}})
		// 	.then(result => this.setState({fans: result.data})))
	} 
	fetchTickets = gig => {
		app.service('tickets').find({query: {gig_id: gig._id, status:'Attending'}})
		.then(result => {
			this.setState({venue: gig.venue, gig, ticket:result.data[0]})
		})
	}

	viewActDetails = act => browserHistory.push('/gyps/acts/'+act._id)

	render() {
		const { gig, venue, fans, ticket } =  this.state
		const { onJoin, onLeave, status } = this.props
		const handleJoin = onJoin || gigJoin
		const handleLeave = onLeave || gigLeave
		
		const attending = (status || (ticket && ticket.status)) === 'Attending'
		const volunteering = (status || (ticket && ticket.status)) === 'Volunteering'

		const card = 
			gig.type==='Workshop' ? 
				<WorkshopCard 
					gig={gig} 
					onMasterSelect={this.viewActDetails}
				/> : 
				gig.type==='Volunteer' ?
					<VolunteerCard gig={gig} /> : 
					<PerformanceCard 
						gig={gig} 
						ticket={ticket}
						onPerformerSelect={this.viewActDetails}
					/>
		const gigTitle = <span>
					<span className='acts'>{gig.acts && gig.acts.map(a => a.name).join(', ')}</span>
					{venue && <span> at the {venue.name}</span>}</span>
		return <div>
			<CardHeader 
				title={gigTitle} 
				subtitle={<GigTimespan gig={gig} showDuration={true} />}
				avatar={<Avatar>{(gig.type && gig.type.charAt(0)) || ' '}</Avatar>}>
			</CardHeader>
			<CardText>
				{card}
			</CardText>
			{ gig.type && gig.type !== 'Volunteer' && 
				<CardActions>
					{attending &&
						<span>
							You are attending 
							<FlatButton style={styles.leave} label='Leave' onTouchTap={handleLeave.bind(this, gig)}/>
						</span>
					}
					{!attending && 
						<RaisedButton primary={true} label='Join' onTouchTap={handleJoin.bind(this, gig)}/>
					}
				</CardActions>
			}
		</div>
	}
}