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
		t.gig_id===this.state.gig._id && this.fetchData(true)
	}

	fetchData = (force) => {
		// console.log("FORCED", force)
		const gigId = this.props.params ? this.props.params.gigId : this.props.gig._id
		// console.log("Fetching ", gigId)
		app.service('gigs').get(gigId)
		.then(gig => {
				if(force || this.props.params) {
					app.service('tickets').find({query: {gig_id: gigId}})
					.then(result => this.setState({...this.state, gig, ticket: result.total ? result.data[0] : null}) )
				} else {
					this.setState({gig})
				}
			}
		)
		
		// not authorized
		// .then(() => app.service('fans')
		// 	.find({query:{gig_id:gigId, status: 'Attending'}})
		// 	.then(result => this.setState({fans: result.data})))
	} 

	viewActDetails = act => browserHistory.push('/gyps/acts/'+act._id)

	render() {
		const { gig, fans, ticket } =  this.state
		const { onJoin, onLeave, status, tickets } = this.props
		const handleJoin = onJoin || gigJoin
		const handleLeave = onLeave || gigLeave
		
		const attending = status ? tickets && tickets[gig._id] === status : (ticket && ticket.status === 'Attending')
		// console.log("GIIG: ", gig)
		// console.log("Attending? ", attending)
		const card = 
			gig.type==='Workshop' ? 
				<WorkshopCard gig={gig} tickets={tickets} onMasterSelect={this.viewActDetails} /> : 
				gig.type==='Volunteer' ?
					<VolunteerCard gig={gig} tickets={tickets} onJoin={handleJoin} onLeave={handleLeave} /> : 
					<PerformanceCard 
						gig={gig} 
						tickets={tickets}
						onPerformerSelect={this.viewActDetails}
					/>
		const gigTitle = <span>
					<span className='acts'>{gig.acts && gig.acts.map(a => a.name).join(', ')}</span>
					{gig.venue && <span> at the {gig.venue.name}</span>}</span>
		return <div>
			<CardHeader 
				title={gigTitle} 
				subtitle={<GigTimespan gig={gig} showDuration={true} />}
				avatar={<Avatar>{(gig.type && gig.type.charAt(0)) || ' '}</Avatar>}>
			</CardHeader>
			<CardText>
				{card}
			</CardText>
			<CardActions>
			{gig.type && gig.type !== 'Volunteer' && 
				<span>
					{attending &&
						<span>
							You are attending 
							<FlatButton style={styles.leave} label='Leave' onTouchTap={handleLeave.bind(this, gig, 'Attending')}/>
						</span>
					}
					{!attending && 
						<RaisedButton primary={true} label='Join' onTouchTap={handleJoin.bind(this, gig, 'Attending')}/>
					}
				</span>
			}
			</CardActions>
		</div>
	}
}