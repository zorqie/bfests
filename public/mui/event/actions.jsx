import React from 'react'
import { Link, browserHistory } from 'react-router'

import RaisedButton from 'material-ui/RaisedButton'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import IconButton from 'material-ui/IconButton'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import {CardActions} from 'material-ui/Card'

import app from '../../main.jsx'
import { gigJoin } from '../utils.jsx'

const moreButton = <IconButton><MoreVertIcon /></IconButton>

const updatePass = (event, status, update) => {
	app.authenticate()
	.then(() => {
		if(update) {
			app.service('tickets').patch(null, {status}, {query: {gig_id: event._id}})			//we never use this...
		} else {
			// insert
			gigJoin(event, status)
		}
	})
	.catch(err => browserHistory.push('/eventinfo/'+event._id))
}


const meets = (req, tickets) => {
	// console.log("Meet ", req)
	if(Array.isArray(req)) {
		// 
		return req.reduce((result, r) => result &= meets(r, tickets), true)
	} else if( typeof req === 'object') {
		//object
		// console.log("Required", req)
		const {status, minCount, maxCount} = req
		const matched = tickets.filter(t => t.status===status)
		if(matched.length < minCount) {
			return false
		}
	} 
	return true
}

export const EventActions = ({event, tickets, route}) => {
	let result = []
	const passes = tickets.filter(t=> t.gig_id === event._id)
	// console.log("ACTIONS FOR EVENT", event)
	// console.log("PASSES", passes)
	if(passes && passes.length) {
		//at least one ticket
		passes.forEach(pass => {
			const rules = event.ticket_rules.filter(r => r.status===pass.status)

			rules.forEach(({requires, actions}) => {
				if(meets(requires, tickets)) {
					result = result.concat(actions)
				}
				// if(Array.isArray(requires)) {
				// 	// 
				// 	console.log("HURRAY, ARRAY (so we ignore it for now...)", requires)
				// } else if( typeof requires === 'object') {
				// 	//object
				// 	// console.log("Required", requires)
				// 	const {status, minCount, maxCount} = requires
				// 	const matched = tickets.filter(t => t.status===status)
				// 	if(matched.length >= minCount) {
				// 		result = result.concat(actions)
				// 	}
				// } else {
				// 	// no requires or something weird
				// 	result = result.concat(actions)
				// }
			})
			// console.log("RULEZ!", rules)
		})
	} else if(passes && event.ticket_rules) {
		const rule = event.ticket_rules.find(r => r.status===null)
		result = result.concat(rule.actions)
		// console.log("rule", rule)
	}

	const actions = result.filter(a => a.name && (a.newStatus || ('/'+route !== a.path)))
	// console.log("ACTING", actions)
	const s = actions.length>2 ? {marginTop:'-4.5em', float:'right'} : {}
	return <CardActions style={s}>
		{actions.length > 2 
			? <IconMenu iconButtonElement={moreButton} >
				{actions.map( ({name, path, newStatus}) => 
					path
					? 	<Link 
							key={name} 
							to={path.replace(':eventId', event._id)} 
							activeStyle={{display: 'none'}}
							style={{textDecoration:'none'}}
						>
							<MenuItem primaryText={name} />
						</Link>
					: <MenuItem 
						key={name} 
						primaryText={name} 
						onTouchTap={updatePass.bind(null, event, newStatus, false)} 
					/>
				)}
			</IconMenu>
			: actions.map( ({name, path, newStatus}) => 
				path 
					? <Link 
						key={event._id + name} 
						to={path.replace(':eventId', event._id)} 
						activeStyle={{display: 'none'}}
					>
						<RaisedButton label={name} /> 
					</Link>
					: <RaisedButton 
						key={event._id + name} 
						primary={true} 
						label={name} 
						onTouchTap={updatePass.bind(null, event, newStatus, false)} 
					/>
			)
		}
	</CardActions>
}

export default EventActions