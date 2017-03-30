import React from 'react'
import { browserHistory } from 'react-router'

import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {ListItem} from 'material-ui/List'

import app from '../../main.jsx'
import { addIcon } from '../icons.jsx'
import GigTimespan from '../gig-timespan.jsx'
import ShiftDialog from './shift-dialog.jsx'
import { Kspan } from '../hacks.jsx'
import { gigJoin, gigLeave } from '../utils.jsx'

const styles = {
	gigType: {
		fontSize: '12dp',
		fontWeight: '300',
		float: 'right'
	}
}

function isAttending(gig, tickets, status='Attending') {
	return tickets && tickets[gig._id] === status
}

function ActionButton({gig, tickets, status='Attending', onJoin, onLeave}) { 

	return isAttending(gig, tickets, status) 
			? <FlatButton label="Leave" secondary={true} onTouchTap={onLeave.bind(null, gig, status)} /> 
			: <RaisedButton label="Join" primary={true} onTouchTap={onJoin.bind(null, gig, status)}/> 
}

function ShiftItem({shift, onSelect, actionButton}) {
	const primary = shift.type==='Volunteer' ? <GigTimespan gig={shift} /> : <div>{shift.name}-{shift.description}</div> 
	const secondary = shift.type==='Volunteer' ? '' : <GigTimespan gig={shift} />
	// console.log("SHIFT", shift)
	// console.log("Action button: ", actionButton)
	return <ListItem 
			primaryText={primary}
			secondaryText={secondary}
			onTouchTap={onSelect}
			rightIconButton={<Kspan>{actionButton}</Kspan>}
		/>
}

export default class ActivityCard extends React.Component {
	state = {
		shifts: [],
		dialog: {
			open: false, 
			shift: {}, 
		},
	}
	componentWillMount() {
		app.authenticate().then(this.fetchData)
	}

	componentDidMount() {
		//setup listeners
		app.service('gigs').on('created', this.createdListener)
		app.service('gigs').on('removed', this.removedListener)
		app.service('gigs').on('patched', this.patchedListener)
	}
	componentWillUnmount() {
		//remove listeners
		if(app) {
			app.service('gigs').removeListener('created', this.createdListener)
			app.service('gigs').removeListener('removed', this.removedListener)
			app.service('gigs').removeListener('patched', this.patchedListener)
		}
	}
	fetchData = () => {
		if(this.props.tickets) {
			console.log("Fetching tickets for ", this.props.gig)
			app.service('gigs').find({
				query: { 
					parent: this.props.gig._id, 
					$sort: {start: 1}
				}
			})
			.then(result => this.setState({shifts: result.data}))
		}
	}

// Listeners
	createdListener = shift => {
		console.log("Created", shift)
		console.log("THIS IS", this.props.gig)
		if(shift.parent === this.props.gig._id) {
			this.setState({shifts: this.state.shifts.concat(shift)})
		}
	}
	removedListener = shift => {
		if(shift.parent === this.props.gig._id) {
			this.setState({shifts: this.state.shifts.filter(s => s._id !== shift._id)})
		}
	}
	patchedListener = shift => {
		if(shift.parent === this.props.gig._id) {
			this.fetchData()
		}
	}

	// viewShift = shift => browserHistory.push('/shifts/'+shift._id)

	viewShift = shift => {
		const { dialog } = this.state
		Object.assign(dialog, {open: true, shift})
		this.setState({dialog})
	} 


	dialogCancel = () => {
		this.setState({dialog: {open: false, shift:{}}})
	}


	render() {
		const { gig, tickets, ...others /*onJoin, onLeave*/ } = this.props 
		const { shifts, dialog } = this.state
		console.log("CARD props", this.props)
		const status = gig.type==='Volunteer' ? 'Volunteering' : 'Attending'
		return <div>
			<span style={styles.gigType}>{gig.type}</span> 
			<h2>{gig.name}</h2>
			<p>{gig.description}</p>
			{shifts.map(shift => 
				<ShiftItem 
					key={shift._id} 
					shift={shift}
					onSelect={this.viewShift.bind(this, shift)}
					actionButton={<ActionButton gig={shift} status={status} tickets={tickets} {...others}/>}
				/>
			)}
			<div style={{marginTop:'1.5em'}}>
				{gig.type && tickets && !shifts.length && <ActionButton gig={gig} status={status} tickets={tickets} {...others}/>}
			</div>
			<ShiftDialog {...dialog} onCancel={this.dialogCancel} />
		</div>
	}
}
