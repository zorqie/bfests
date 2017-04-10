import React from 'react'
import { Link, browserHistory } from 'react-router'
import moment from 'moment'

import CircularProgress from 'material-ui/CircularProgress'
import { List, ListItem } from 'material-ui/List'
import Divider from 'material-ui/Divider'

import app from '../main.jsx'
import GigListItem from './gig-list-item.jsx'
import GigTimespan from './gig-timespan.jsx'
import LineupItem from './lineup-item.jsx'
import styles from './styles'

const startTimeSort = (a, b) => +(a.start > b.start) || +(a.start === b.start) - 1

export default class PerformanceList extends React.Component {
	state = {
		gigs: [],
		dates: [],
		loading: true,
	}

	componentWillMount() {
		app.authenticate().then(this.fetchData)
	}

	fetchData = () => {
		const my = app.get('user')

		// app.service('acts').find({query: {user_id: my._id}})
		// .then(acts => 
			app.service('gigs').find({
				query: {
					act_id: {$in: my.acts.map(a => a._id)},
					$sort: {start: 1}
				}
			})
			.then(result => {
				const formated = result.data.map(g => moment(g.start).format('YYYY-MM-DD'))
				// console.log("Formated", formated)
				const unique = formated.filter((e, i, a) => a.indexOf(e)===i)
				// console.log("Unique", unique)
				const sorted = unique.sort()
				const dates = sorted.map(s => moment(s, 'YYYY-MM-DD'))
								// a little hacky format -> parse but
								// works better than 0-ing time
				// console.log("Dates", dates)
				this.setState({gigs: result.data, dates, loading: false})
			})
		// )
		.catch(err => console.error)
	}

	select = gig => {
		browserHistory.push('/my-gigs/' + gig._id)
	}

	render() {
		const { dates, gigs, loading } = this.state
		// console.log("MY gigging", this.state) 
		return <div style={styles.lineup.container}>
			{ loading && <CircularProgress /> || ''}
			{ !loading && gigs.length==0 ?
				<div>No events found.</div> 
				: ''
			}
			{dates.map(d =>
				<List key={d}>
					<div style={styles.lineup.date}>{d.format('MMM D, dddd')}</div>
					<Divider/>
					{gigs.filter(g => moment(g.start).isSame(d, 'day'))
						.sort(startTimeSort)
						.map(gig => 
							<LineupItem
								key={gig._id}
								gig={gig}
								hideDates={true}
								onSelect={this.select.bind(this, gig)}
							/>
					)}
				</List>
			)}
		</div>
	}
}