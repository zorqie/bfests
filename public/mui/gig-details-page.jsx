import React from 'react'
import { browserHistory } from 'react-router';

import app from '../main.jsx'
import deny from './err'
import { gigJoin, gigLeave } from './utils.jsx'

import GigCard from './gig-card.jsx'

export default class GigDetailsPage extends React.Component {
	state = {
		gig: {},
		shifts: [],
		loaded: false,
	}

	componentDidMount() {
		app.authenticate().then(this.fetchData)
		.catch(deny)
		// attach listeners
		app.service('gigs').on('patched', this.fetchData)
	}

	componentWillUnmount() {
		// remove listners
		// console.log("UNMOUNTIFYING")
		app.service('gigs').removeListener('patched', this.fetchData)
	}

	componentWillReceiveProps(next) {
		// console.log("this.state", this.state)
		// console.log("next.params", next.params)
		// console.log("this.params", this.props.params)
		if (next.params !==this.props.params) {
			this.setState({loaded: false})
			this.fetchData(next.params)
		}
	}

	fetchData = (params) => {
		const gigId = params.gigId || this.props.params.gigId
		console.log("Fetching ", gigId)
		if(gigId) {
			app.service('gigs').get(gigId)
			.then(gig => {
				this.setState({gig})
				return app.service('gigs').find({
					query: {parent: gig._id}
				})
			})
			.then(result => this.setState({shifts: result.data, loaded: true}))
			.catch(err => console.log("It can't be: ", err))
		}
	} 

	viewActDetails = act => browserHistory.push('/acts/'+act._id)

	render() {
		const { gig, shifts, loaded } =  this.state
		const { onJoin, onLeave, ticketsByGig } = this.props

		const handleJoin = onJoin || gigJoin
		const handleLeave = onLeave || gigLeave
				
		const gigProps = {gig, shifts, handleJoin, handleLeave, ticketsByGig, viewActDetails: this.viewActDetails}

		return loaded 
			&& <GigCard {...gigProps} /> 
			|| null
	}
}

GigDetailsPage.propTypes = {
	ticketsByGig: React.PropTypes.object.isRequired, // map gig._id = status
	onJoin: React.PropTypes.func, 
	onLeave: React.PropTypes.func, 
}