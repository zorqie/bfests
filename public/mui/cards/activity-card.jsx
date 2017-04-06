import React from 'react'
import { browserHistory } from 'react-router'

import Divider from 'material-ui/Divider'
import FlatButton from 'material-ui/FlatButton'
import RaisedButton from 'material-ui/RaisedButton'
import {ListItem} from 'material-ui/List'

import app from '../../main.jsx'
import { addIcon } from '../icons.jsx'
import GigTimespan from '../gig-timespan.jsx'
import ActsList from '../acts-list.jsx'
import { Kspan } from '../hacks.jsx'
import { gigJoin, gigLeave, isAttending, viewGig, viewAct } from '../utils.jsx'

import styles from '../styles'

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

	render() {
		const { gig, shifts, ticketsByGig, ...others /*onJoin, onLeave*/ } = this.props 
		// console.log("CARD props", this.props)
		const status = gig.type==='Volunteer' ? 'Volunteering' : 'Attending'
		const actsTitle = gig.type==='Workshop' ? 'Led by:' : gig.type==='Performance' ? 'Featuring: ' : ''
		return gig._id && <div>
			<span style={styles.gigType}>{gig.type}</span> 
			<h2>{gig.name}</h2>
			<p>{gig.description}</p>
			{gig.type!=='Volunteer'
				&& <ActsList acts={gig.acts} onSelect={viewAct} title={actsTitle} />
			}
			{shifts.map(shift => 
				<ShiftItem 
					key={shift._id} 
					shift={shift}
					onSelect={viewGig.bind(this, shift)}
					actionButton={<ActionButton gig={shift} status={status} tickets={ticketsByGig} {...others}/>}
				/>
			)}
			{shifts.length == 0
				&& <div style={{marginTop:'1.5em'}}>
						{gig.type && ticketsByGig && <ActionButton gig={gig} status={status} tickets={ticketsByGig} {...others}/>}
					</div>
			}
		</div>
		|| null
	}
}
