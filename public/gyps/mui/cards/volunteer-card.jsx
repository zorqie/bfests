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

export default class VolunteerCard extends React.Component {
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
			this.setState({...this.state, shifts: this.state.shifts.concat(shift)})
		}
	}
	removedListener = shift => {
		if(shift.parent === this.props.gig._id) {
			this.setState({...this.state, shifts: this.state.shifts.filter(s => s._id !== shift._id)})
		}
	}
	patchedListener = shift => {
		if(shift.parent === this.props.gig._id) {
			this.fetchData()
		}
	}

	// viewShift = shift => browserHistory.push('/shifts/'+shift._id)

	viewShift = shift => {
		console.log("Editshifting", shift)
		const { dialog } = this.state
		Object.assign(dialog, {open: true, shift})
		this.setState({...this.state, dialog})
	} 


	dialogCancel = () => {
		this.setState({...this.state, dialog: {open: false, shift:{}}})
	}


	render() {
		const { gig, tickets, onJoin, onLeave } = this.props 
		const { shifts, dialog } = this.state
		console.log("TIckets?", this.state)
		const isAttending = gig => tickets && tickets[gig._id] === "Volunteering"
		const actionButton = what => tickets ? 
			(isAttending(what) ? 
					<FlatButton label="Leave" onTouchTap={onLeave.bind(null, what, 'Volunteering')} /> :
					<RaisedButton label="Join" primary={true} onTouchTap={onJoin.bind(null, what, 'Volunteering')}/> ) : ''
		return <div>
			<span style={styles.gigType}>Volunteer opportunity</span> 
			<h2>{gig.name}</h2>
			<p>{gig.description}</p>
				{shifts.map(shift => 
					<ListItem 
						key={shift._id} 
						primaryText={<GigTimespan gig={shift} />}
						onTouchTap={this.viewShift.bind(this, shift)}
						rightIconButton={ actionButton(shift) }

					/>
				)}
				{tickets && !shifts.length && actionButton(gig)}
			<ShiftDialog {...dialog} onCancel={this.dialogCancel} />
		</div>
	}
}
