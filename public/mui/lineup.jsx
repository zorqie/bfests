import React from 'react'
import { Link, browserHistory } from 'react-router'
import moment from 'moment'

import CircularProgress from 'material-ui/CircularProgress'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'

import app from '../main.jsx'
import GigListItem from './gig-list-item.jsx'
import GigTimespan from './gig-timespan.jsx'
import LineupItem from './lineup-item.jsx'
import {viewGig} from './utils.jsx'
import styles from './styles'

function days(tickets) {
	// console.log("Teekets:", result)
	const formated = tickets.map(t => moment(t.gig.start).format('YYYY-MM-DD'))
	// console.log("Formated", formated)
	const unique = formated.filter((e, i, a) => a.indexOf(e)===i)
	// console.log("Unique", unique)
	const sorted = unique.sort()
	const dates = sorted.map(s => moment(s, 'YYYY-MM-DD'))
	console.log("DAYS:: ", dates)
	return dates
}

export default class Lineup extends React.Component {

	render() {
		const { tickets, status } = this.props
		// console.log("LINEUP props", this.props)
		const filtered = tickets && tickets.filter(t=> t.status===(status || 'Attending'))
		
		// console.log("LINEUP filtered", filtered) 
		// console.log(dates)
		return <div style={styles.lineup.container}>
			{ filtered && filtered.length==0 ?
				<Subheader>No events found. <Link to='/events'>Choose some</Link></Subheader> 
				: ''
			}
			{ filtered && days(filtered).map(d =>
				<List key={d}>
					<Subheader style={styles.lineup.date}>{d.format('MMM D, dddd')}</Subheader>
					<Divider/>
					{filtered.filter(t => moment(t.gig.start).isSame(d, 'day'))
						.sort((a, b) => +(a.gig.start > b.gig.start) || +(a.gig.start === b.gig.start) - 1)
						.map(({gig}) => 
							<LineupItem
								key={gig._id}
								gig={gig}
								hideDates={true}
								onSelect={viewGig.bind(this, gig)}
							/>
					)}
				</List>
			)}
		</div>
	}
}