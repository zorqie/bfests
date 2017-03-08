import React from 'react'
import { browserHistory } from 'react-router'

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'
import FlatButton from 'material-ui/FlatButton'
import { List, ListItem } from 'material-ui/List'

import GigTimespan from './gig-timespan.jsx'
import app from '../main.jsx'

const styles = {
	overlay: {
		color:'white',
		margin: '1em'
	},
	card: {
		margin: '2em'
	},
	titleRight: {
		float: 'right'
	}
}

export default class EventsList extends React.Component {
	state = {
		events: [],
	}
	componentDidMount() {
		app.service('gigs').find({query: {public: true}})
		.then(result => this.setState({events: result.data}))
		.catch(err => console.error)
	}
	select = e => {
		if(app.get('user')) {
			browserHistory.push('/gyps/events/'+e._id)
		} else {
			browserHistory.push('/gyps/eventinfo/'+e._id)
		}
	}
/*	render() {
		return <div>
			{this.state.events.map(
				e => <ListItem
						key={e._id}
						primaryText={e.name}
						secondaryText={<GigTimespan gig={e} showRelative={true} />}
						onTouchTap={this.select.bind(this, e)}
						rightIconButton={<FlatButton label='Get tickets' />}
					/>
			)}
		</div>
	}*/
	render() {
		return <div>
			{this.state.events.map(event => 
				<Card key={event._id} style={styles.card} initiallyExpanded={true} >
				    <CardTitle 
				    	title={<span><b>{event.name}</b><FlatButton style={styles.titleRight} label='View details' onTouchTap={this.select.bind(this, event)} /></span>} 
				    	subtitle={<GigTimespan gig={event} showRelative={true}/>} 
				    	actAsExpander={true}
				    >
				    
				    </CardTitle>
				    <CardMedia 

				    	expandable={true}
				    >
						<img src={`/img/${event._id}_poster.jpg`} />
					</CardMedia>
					<CardText actAsExpander={true}>
						<p>{event.description}</p>
					</CardText>
					
					<CardActions>
						<FlatButton label="Get tickets" secondary={true} />
					</CardActions>
				</Card>
			)}
		</div>
	}
}