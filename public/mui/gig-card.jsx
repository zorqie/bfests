import React from 'react'

import Avatar from 'material-ui/Avatar'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import ActivityCard from './cards/activity-card.jsx'
import ActsList from './acts-list.jsx'
import GigTimespan from './gig-timespan.jsx'
import GigTitle from './gig-title.jsx'

export default function GigCard({gig, shifts, ticketsByGig, handleJoin, handleLeave, viewActDetails}) {
	const avatar = gig.type==='Performance' 
		? <Avatar size={60} src={`/img/${gig._id}_tile.jpg`} />
		: <Avatar>{(gig.type && gig.type.charAt(0)) || ' '}</Avatar>
	return gig && gig._id && <div >
				<CardHeader 
					title={<GigTitle gig={gig} />} 
					subtitle={<GigTimespan gig={gig} showDuration={true} />}
					avatar={<Avatar>{avatar}</Avatar>}>
				</CardHeader>
				<CardText>
					<ActivityCard 
						gig={gig} 
						shifts={shifts}
						ticketsByGig={ticketsByGig} 
						onJoin={handleJoin} 
						onLeave={handleLeave} 
						onActSelect={viewActDetails} 
					/>
				</CardText>
				<CardActions>
				</CardActions>
			</div>
			|| null
}