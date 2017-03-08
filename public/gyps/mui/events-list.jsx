import React from 'react'
import { browserHistory } from 'react-router'

import FlatButton from 'material-ui/FlatButton'
import { List, ListItem } from 'material-ui/List'

import GigTimespan from './gig-timespan.jsx'
import app from '../main.jsx'

export default class EventsList extends React.Component {
	state = {
		events: [],
	}
	componentDidMount() {
		app.service('gigs').find({query:{public: true}})
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
	render() {
		return <List>
			{this.state.events.map(
				e => <ListItem
						key={e._id}
						primaryText={e.name}
						secondaryText={<GigTimespan gig={e} showRelative={true} />}
						onTouchTap={this.select.bind(this, e)}
						rightIconButton={<FlatButton label='Get tickets' />}
					/>
			)}
		</List>
	}
}