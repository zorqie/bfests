import React from 'react'
import { Link, browserHistory } from 'react-router'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import { List, ListItem } from 'material-ui/List'

import GigTimespan from './gig-timespan.jsx'
import EventActions from './event/actions.jsx'
import EventInfo from './event/info.jsx'
import app from '../main.jsx'
import { gigJoin } from './utils.jsx'

const styles = {
	card: {
		margin: '2em'
	},
	titleRight: {
		float: 'right'
	}
}

const viewEvent = e => browserHistory.push('/events/'+e._id)

const EventTitle = ({event, auth}) =>
	<span>
		<b>{event.name}</b>
		{auth 
			&& <FlatButton 
					style={styles.titleRight} 
					label='View details' 
					onTouchTap={viewEvent.bind(null, event)} 
				/>
			|| ''
		}
	</span>

export default class EventsList extends React.Component {
	state = {
		events: [],
	}
	componentWillMount() {
		app.service('gigs').find({query: {public: true, $sort:{start:1}}})
		.then(gigs => this.setState({events: gigs.data}))
		.catch(err => console.error)
	}

	render() {
		const {events} = this.state
		const {tickets} = this.props
		const auth = !!app.get('user')
		// console.log("AUTH", auth)
		// console.log("E-vents", events)
		// console.log("teekettes", tickets)
		return <div>
			{events.map(event => 
				<Card key={event._id} style={styles.card} initiallyExpanded={true} >
				    <CardTitle 
				    	title={<EventTitle event={event} auth={auth} />} 
				    	subtitle={<GigTimespan gig={event} showRelative={true}/>} 
				    	actAsExpander={true}
				    />
				    
					<CardMedia expandable={true} >
						<img src={`/img/${event._id}_poster.jpg`} />
					</CardMedia>
					<CardText actAsExpander={true}>
						<p>{event.description}</p>
						<EventInfo event={event} tickets={tickets} />

					</CardText>
										
					{auth 
						&& <EventActions event={event} tickets={tickets} />
						
					}
					
				</Card>
			)}
			{!auth &&  <p>To use this system you must <Link to='/login'>sign in</Link></p>}
		</div>
	}
}