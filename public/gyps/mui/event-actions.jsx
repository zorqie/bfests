import React from 'react'
import { Link, browserHistory } from 'react-router'

import RaisedButton from 'material-ui/RaisedButton'
import {CardActions} from 'material-ui/Card'

import app from '../main.jsx'
import { gigJoin } from './utils.jsx'

const updatePass = (event, status, update) => {
	app.authenticate()
	.then(() => {
		if(update) {
			
		} else {
			// insert
			gigJoin(event, status)
		}
	})
	.catch(err => browserHistory.push('/gyps/eventinfo/'+event._id))
}


export const EventActions = ({event, tickets, route}) => {
	let result = []
	if(event.tickets && event.tickets.length) {
		//at least one ticket
		event.tickets.forEach(pass => {
			const rules = event.ticket_rules.filter(r => r.status===pass.status)
			rules.forEach(({requires, actions}) => {
				if(Array.isArray(requires)) {
					// 
					console.log("HURRAY, ARRAY", requires)
				} else if( typeof requires === 'object') {
					//object
					const {status, minCount, maxCount} = requires
					const matched = tickets.filter(t => t.status===status)
					if(matched.length >= minCount) {
						result = result.concat(actions)
					}
				} else {
					// no requires or something weird
					result = result.concat(actions)
				}
			})
			console.log("RULEZ!", rules)
		})
	} else if(event.tickets) {
		const only = event.ticket_rules.find(r => r.status===null)
		result = result.concat(only.actions)
		console.log("only", only)
	}

	const actions = result.filter(a => a.name && (route !== a.path))
	console.log("ACTING", actions)

	return <CardActions>
		{actions.map( ({name, path, newStatus}) => path ? 
					<Link key={event._id + name} to={'/gyps/'+path.replace(':eventId', event._id)} >
						<RaisedButton  label={name} /> 
					</Link> : 
					<RaisedButton 
						key={event._id + name} 
						primary={true} 
						label={name} 
						onTouchTap={updatePass.bind(null, event, newStatus)} 
					/>
				
		)}
	</CardActions>
}

export default EventActions