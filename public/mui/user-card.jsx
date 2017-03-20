import React from 'react';

import { Link, browserHistory } from 'react-router';

import {Card, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton'
import MenuItem from 'material-ui/MenuItem';

import app from '../main.jsx';
import errorHandler from './err'

const hasRole = role => {
	const u = app.get('user')
	return u && u.roles && u.roles.indexOf(role) > -1
}

export default class UserCard extends React.Component {
	componentDidMount() {
		console.log("UserCard mounted")
		// app.service('tickets').find()
		// .then(result => {
		// 	if(result.total > 0) {
		// 		result.data.map(ticket => localStorage.setItem("bfest-"+ticket.gig_id, ticket.status))
		// 		console.log("LOCAL: ", localStorage);
		// 	}

		// })
		// .catch(err => console.error("Failed.",err))
	}
	goLineup = () => browserHistory.push('/lineup') & this.props.onNavigate() // hacksy
	goTasks = () => browserHistory.push('/tasks') & this.props.onNavigate()
	goPerf = () => browserHistory.push('/performances') & this.props.onNavigate()
	goWorkshops = () => browserHistory.push('/workshops') & this.props.onNavigate()
	
	
	render() {
		const { user } = this.props;
		return <Card>
					<CardHeader
						title={user.name}
						subtitle={user.email}
						avatar=""
					/>
						<MenuItem primaryText="My lineup" onTouchTap={this.goLineup}/>
						<MenuItem primaryText="My tasks" onTouchTap={this.goTasks}/>
						{hasRole('performer') && <MenuItem primaryText="My performances" onTouchTap={this.goPerf} />}
						{hasRole('master') && <MenuItem primaryText="My workshops" onTouchTap={this.goWorkshops} />}
				</Card>
	}
}