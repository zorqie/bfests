import React from 'react'
import { Link, browserHistory } from 'react-router'
import moment from 'moment'

import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'

import GigTimespan from './gig-timespan.jsx'
import app from '../main.jsx'

const styles = {
	date: {
		fontFamily: 'Roboto, sans-serif',
		fontWeight: 300,
		fontSize: '24px'
	}
}

export default class Lineup extends React.Component {
	state = {
		tickets: [],
		dates: [],
	}
	componentDidMount() {
		app.authenticate().then(this.fetchData)
	}
	fetchData = () => {
		app.service('tickets').find({query: {status:'Attending'}})
		.then(result => {
			
			if(result.total) {
				console.log("Teekets:", result)
				const formated = result.data.map(t => {
					console.log("t=", t)
					return moment(t.gig.start).format('YYYY-MM-DD')
				})
				console.log("Formated", formated)
				const unique = formated.filter((e, i, a) => a.indexOf(e)===i)
				console.log("Unique", unique)
				const dates = unique.map(s => moment(s, 'YYYY-MM-DD'))
								// a little hacky format -> parse but
								// works better than 0-ing time
				console.log("Dates", dates)
				this.setState({tickets: result.data, dates})
			}
		})
		.catch(err => console.error)
	}

	select = t => {
		browserHistory.push('/gyps/gig/'+t.gig_id)
	}

	render() {
		const { dates, tickets } = this.state
		console.log("LINEUP", this.state) 
		console.log(dates)
		return <div>
			{ tickets.length==0 ?
				<Subheader>You haven't joined any events. <Link to='/gyps/events'>Choose some</Link></Subheader> 
				: ''
			}
			{dates.map(d =>
			<List key={d}>
				<Subheader style={styles.date}>{d.format('MMM D, dddd')}</Subheader>
				<Divider/>
				{tickets.filter(t => moment(t.gig.start).isSame(d, 'day'))
					.map(
					ticket => <ListItem
							key={ticket._id}
							primaryText={ticket.gig.name}
							secondaryText={<GigTimespan gig={ticket.gig} hideDates={true} />}
							onTouchTap={this.select.bind(this, ticket)}
						/>
				)}
			</List>
			)}
		</div>
	}
}