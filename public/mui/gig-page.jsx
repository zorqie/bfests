import React from 'react'
import moment from 'moment'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import {List, ListItem} from 'material-ui/List'
import Subheader from 'material-ui/Subheader'

import GigTimespan from './gig-timespan.jsx'
import app from '../main.jsx';

export default class GigPage extends React.Component {
	state = {
		pals: [],  // but how to get them, tickets are restricted to owner_id
		gig: {},
		venue: {},
	}
	fetchData = () => {
		const { gigId } = this.props.params;

		return app.service('gigs').get(gigId)
		.then(gig =>
			app.service('venues').get(gig.venue)
			.then(venue => 
				this.setState({gig, venue})
			)
		)
	}
	componentWillMount() {
		app.authenticate().then(this.fetchData)
		.catch(err => console.error("It can't be: ", err))
	}
	render() {
		const { gig, venue } =  this.state
		console.log("GIIG", gig)
		return <Card>
			<CardHeader title={gig.name}/>
			<CardText>
				<p>{gig.acts && gig.acts.map(a => a.name).join(',')} at the {venue.name}</p>
			</CardText>
		</Card>
	}
}