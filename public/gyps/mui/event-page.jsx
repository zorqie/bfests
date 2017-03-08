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

import GigTimespan from './gig-timespan.jsx'
import app from '../main.jsx';
import { plusOutline, minusBox } from './icons.jsx';

//hack because Material-UI forces a onKeyboardFocus onto the span and React complains
const Kspan = ({onKeyboardFocus, ...others}) => <span {...others}/>; 

export default class EventPage extends React.Component {
	state = {
		gigs:[], 
		tickets: {},
		gig: {},
		venue: {},
		sites: [],
		dialogOpen: false,
		dialogGig: {},
		errors: {},
	}
	
	componentWillMount() {
		app.authenticate().then(this.fetchData)
		app.service('gigs').on('removed', this.gigRemoved);
		app.service('gigs').on('created', this.gigCreated);
		app.service('gigs').on('patched', this.gigPatched);
		app.service('tickets').on('patched', this.ticketPatched);
		app.service('tickets').on('created', this.ticketCreated);
	}
	componentDidMount() {
		app.service('tickets').find()
		.then(result => {
			console.log("Got tickets", result)
			const tickets = result.data.reduce((o, t) => Object.assign(o, {[t.gig_id]:t.status}), {})
			this.setState({...this.state, tickets})
		})
	}
	componentWillUnmount() {
		if(app) {
			app.service('gigs').removeListener('removed', this.gigRemoved);
			app.service('gigs').removeListener('created', this.gigCreated);
			app.service('gigs').removeListener('patched', this.gigPatched);
			app.service('tickets').removeListener('patched', this.ticketPatched);
			app.service('tickets').removeListener('created', this.ticketCreated);
		}
	}

	fetchData = () => {
		const eventId = this.props.params.eventId;

		app.service('gigs').get(eventId)
		.then(gig => {
			document.title = gig.name;			
			app.service('gigs').find({
				query: {
					parent: new mongoose.Types.ObjectId(eventId),
					type: {$ne: 'Volunteer'},
					$sort: { start: 1 },
					// $limit: this.props.limit || 7
				}
			})
			.then(page => {
				// console.log("Got result: ", page);			
				this.setState({...this.state, gigs: page.data, gig})
			})})
		.catch(err => console.error("ERAR: ", err))
	}

	handleDialogCancel = e => {
		// console.log("Canceling...");
		this.setState({dialogOpen: false})
	}
	
	isAttending = gig => {
		return this.state.tickets[gig._id] === "Attending" 
	}

	ticketPatched = t => {
		console.log("Patched", t)
		// if(this.isAttending(t.gig_id) && t.status !== "Attending") {
			const {tickets} = this.state
			Object.assign(tickets, {[t.gig_id]: t.status})
			this.setState({...this.state, tickets})
		// }
	}
	ticketCreated = t => {
		console.log("created", t)
		const {tickets} = this.state
		Object.assign(tickets, {[t.gig_id]: t.status})
		this.setState({...this.state, tickets})
		
	}

	handleJoin = gig => {
		console.log("Joining gig", gig)
		if(this.isAttending(gig)) {
			// patch
		} else {
			app.service('tickets').create({gig_id: gig._id, status: "Attending"})
		}
	}

	handleLeave = gig => {
		console.log("Leaving gig", gig)
		if(this.isAttending(gig)) {
			app.service('tickets').patch(null, {status: null}, {query:{gig_id: gig._id}})
		}
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

	viewGigDetails = gig => browserHistory.push('/gyps/gig/'+gig._id)

	render() {
		const {gig, venue} = this.state;
		// console.log("GIGGGINGING: ", this.state);
		const title = <b>{gig.name}</b>;

		const subtitle = <GigTimespan gig={gig} showRelative={true}/>;

		return (
			<Card initiallyExpanded={true}>
			    {/*<CardHeader title={v.name} subtitle="gig" />*/}
			    <CardTitle 
			    	title={title} 
			    	subtitle={subtitle} 
			    	actAsExpander={true} 
			    	showExpandableButton={true}
			    />
				<CardText expandable={true}>
					

					{this.state.gigs.map(
						gig => <ListItem 
									key={gig._id} 
									primaryText={gig.name} 
									onTouchTap={this.viewGigDetails.bind(this, gig)}
									secondaryText={<GigTimespan gig={gig} />} 
									rightIconButton={
										this.isAttending(gig) ?
										<FlatButton 
											icon={minusBox}
											title="Leave" 
											onTouchTap={this.handleLeave.bind(this, gig)}
										/>
										:
										<FlatButton 
											icon={plusOutline}
											title="Join" 
											onTouchTap={this.handleJoin.bind(this, gig)}
										/>
									}
					/>)}
				</CardText>
				
				<CardActions>
					<FlatButton label="Volunteer" secondary={true}/>
				</CardActions>
			</Card>
		);
	}
}