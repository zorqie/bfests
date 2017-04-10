import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router';

import app from '../main.jsx'
import deny from './err'
import { gigJoin, gigLeave } from './utils.jsx'

import GigHeader from './gig-header.jsx'

export default class MyGigDetails extends React.Component {
	state = {
		gig: {},
		fans: [],
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

				app.service('fans').find({
					query: {
						gig_id: gig._id,
						$sort: {createdAt: -1}
					}
				})
				.then(result => result && this.setState({fans: result.data, total: result.total}))
			})
			.catch(err => console.log("It can't be: ", err))
		}
	} 

	viewActDetails = act => browserHistory.push('/acts/'+act._id)

	render() {
		const { gig, fans, total } =  this.state

		// console.log("Hooked", this.state)
		return <div>
					<GigHeader gig={gig} />
					<h2>{gig.name}</h2>
					<p>{gig.description}</p>
					{fans.length 
						&&	<div className='gig-fans'>
								<div>Attending: {total}</div>
								{fans.map(t => 
									<span key={t._id}>{t.user.name}</span>)
								}
							</div>
						|| ''}
				</div> 
	}
}
