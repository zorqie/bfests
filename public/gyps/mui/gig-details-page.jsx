import React from 'react'
import moment from 'moment'
import mongoose from 'mongoose'
import { browserHistory } from 'react-router';

import Avatar from 'material-ui/Avatar'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'
import Dialog from 'material-ui/Dialog'

import ActsList from './acts-list.jsx'
import GigTimespan from './gig-timespan.jsx'
import app from '../main.jsx'

import PerformanceCard from './cards/performance-card.jsx'
import WorkshopCard from './cards/workshop-card.jsx'
import VolunteerCard from './cards/volunteer-card.jsx'


export default class GigDetailsPage extends React.Component {
	state = {
		fans: [],  
		gig: {},
		venue: {},
		ticket: {},
	}

	componentWillMount() {
		app.authenticate().then(this.fetchData)
		.catch(err => console.error("It can't be, an erro: ", err))
	}

	componentDidMount() {
		// attach listeners
		app.service('gigs').on('patched', this.fetchData)
	}

	componentWillUnmount() {
		// remove listners
		app.service('gigs').removeListener('patched', this.fetchData)
	}

	fetchData = () => {
		const { gigId } = this.props.params
		
		app.service('gigs').get(gigId)
		.then(gig => {	
			document.title=gig.name	
			app.service('tickets').find({query: {gig_id: gig._id}})
			.then(result =>
				this.setState({venue: gig.venue, gig, ticket:(result.total && result.data[0])})
			)
		})
		// not authorized
		// .then(() => app.service('fans')
		// 	.find({query:{gig_id:gigId, status: 'Attending'}})
		// 	.then(result => this.setState({fans: result.data})))
	} 

	viewActDetails = act => browserHistory.push('/acts/'+act._id)

	render() {
		const { gig, venue, fans, ticket } =  this.state
		console.log("GIIG", this.state)
		const card = 
			gig.type==='Workshop' ? 
				<WorkshopCard 
					gig={gig} 
					fans={fans}
					ticket={ticket}
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
		return <Card>
			<CardHeader 
				title={gigTitle} 
				subtitle={<GigTimespan gig={gig} showDuration={true} />}
				avatar={<Avatar>{gig.type && gig.type.charAt(0)}</Avatar>}>
			</CardHeader>
			<CardText>
				{card}
			</CardText>
			<CardActions>
			</CardActions>
		</Card>
	}
}