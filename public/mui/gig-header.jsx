import React from 'react'

import Avatar from 'material-ui/Avatar'
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card'

import ActivityCard from './cards/activity-card.jsx'
import ActsList from './acts-list.jsx'
import GigTimespan from './gig-timespan.jsx'
import GigTitle from './gig-title.jsx'

export default function GigHeader({gig}) {
	return <CardHeader 
				title={<GigTitle gig={gig} />} 
				subtitle={gig.start && <GigTimespan gig={gig} showDuration={true} /> || ''}
				avatar={<Avatar>{(gig.type && gig.type.charAt(0)) || ' '}</Avatar>}>
			</CardHeader>
}