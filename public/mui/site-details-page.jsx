import React from 'react'
import {browserHistory} from 'react-router'

import app from '../main.jsx'
import GigListItem from './gig-list-item.jsx'

export default class SitePage extends React.Component {
	state = {
		venue: null,
		gigs: [],
	}
	componentDidMount() {
		const {venueId} = this.props.params
		app.service('venues').get(venueId)
		.then(venue => {
			if(venue.parent) {
				// get parent first
				app.service('venues').get(venue.parent)
				.then(parent => {
					Object.assign(venue, {parentVenue: parent})
					this.setState({venue})
				})
			} else {
				this.setState({venue})
			}
			app.service('gigs').find({
				query: {
					venue_id: venue._id,
					parent: {$exists: true}, // should be "this" event but we don't have such
					$sort: {start: 1}
				}
			})
			.then(result => {
				const ids = result.data.map(g => g._id)
				const gigs = result.data.filter(g => !ids.includes(g.parent))
				this.setState({gigs})
			})
		})
	}

	viewGig = gig => browserHistory.push('/gig/'+gig._id)

	render() {
		const {venue, gigs} = this.state
		return venue && <div style={{margin:'2em'}}>
			<h2>{venue.name} {venue.parentVenue ? <span style={{fontWeight:300}}>{' at ' + venue.parentVenue.name}</span>: ''}</h2>
			<p>{venue.description}</p>
			{gigs.map(gig => 
				<GigListItem key={gig._id} gig={gig} onSelect={this.viewGig} />
			)}
		</div>
		|| null
	}
}