import React from 'react'
import moment from 'moment'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

import GigTimespan from './gig-timespan.jsx'
import GigDetailsPage from './gig-details-page.jsx'
import app from '../main.jsx';

export default class GigPage extends React.Component {
	state = {
		gig: {},
		tickets: {},
	}

	componentWillMount() {
		app.authenticate().then(this.fetchData)
		.catch(err => console.error("It can't be: ", err))
	}

	componentDidMount() {
		app.service('tickets').on('created', this.ticketCreated)
		app.service('tickets').on('removed', this.ticketRemoved)
	}

	componentWillUnmount() {
		app.service('tickets').removeListener('created', this.ticketCreated)
		app.service('tickets').removeListener('removed', this.ticketRemoved)
	}

	fetchData = () => {
		const { gigId } = this.props.params;

		return app.service('gigs').get(gigId)
		.then(gig =>
			app.service('tickets').find()
			.then(result => {
				console.log("Got tickets", result)
				if(result.total) {
					// store tickets as a Map of _id = ticket.status pairs
					const tickets = result.data.reduce((o, t) => Object.assign(o, {[t.gig_id]:t.status}), {})
					this.setState({gig, tickets})
				}
			})
		)
	}


	// TODO these are copies from event-page. Must move up
	ticketCreated = t => {
		// console.log("T created", t)
		const {tickets} = this.state
		Object.assign(tickets, {[t.gig_id]: t.status})
		this.setState({tickets})
	}
	ticketRemoved = t => {
		// console.log("T removed", t)
		const {tickets} = this.state
		Object.assign(tickets, {[t.gig_id]: null})
		this.setState({tickets})
	}

	render() {
		const { gig, tickets } =  this.state
		// console.log("GIIG", gig)
		return gig._id 
			&& <GigDetailsPage params={this.props.params} status='Attending' tickets={tickets} />
			|| null
	}
}
		// <Card>
		// 	<CardHeader title={gig.name}/>
		// 	<CardText>
		// 		<p>{gig.acts && gig.acts.map(a => a.name).join(',')} at the {venue.name}</p>
		// 	</CardText>
		// </Card>