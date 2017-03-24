import React from 'react'
import { Link, browserHistory } from 'react-router'
import moment from 'moment'

import CircularProgress from 'material-ui/CircularProgress'
import { List, ListItem } from 'material-ui/List'
import Subheader from 'material-ui/Subheader'
import Divider from 'material-ui/Divider'

import GigListItem from './gig-list-item.jsx'
import GigTimespan from './gig-timespan.jsx'
import app from '../main.jsx'

const styles = {
	date: {
		fontFamily: 'Roboto, sans-serif',
		fontWeight: 300,
		fontSize: '24px'
	},
	item: {
		verticalAlign: 'top',
	},
	time: {
		verticalAlign: 'top',
		display: 'inline-block',
		fontWeight: 300,
		width: '30%',
	},
	gig: {
		display: 'inline-block',
		width: '40%',
	},
	name: {
		fontWeight: 500,
	},
	venue: {
		verticalAlign: 'top',
		display: 'inline-block',
		fontSize: 'small',
		fontWeight: 300,
		letterSpacing: '2px',
		textTransform: 'uppercase',
		width: '30%',
	},
	acts: {
		fontSize: 'small',
		fontWeight: 300,
		color: 'rgba(0, 0, 0, 0.870588)',
	}
}

function LineupItem({gig, onSelect, hideDates, ...others}) {
	return <ListItem
				onTouchTap={onSelect.bind(null, gig)}
				{...others}
				style={styles.item}
			>
			<div style={styles.time}>{<GigTimespan gig={gig} hideDates={hideDates} />}</div>
			<div style={styles.gig}>
				<div style={styles.name}>{gig.name}</div>
				<div style={styles.acts}>{gig.acts && gig.acts.map(a=>a.name).join(', ')}</div>
			</div>
			<div style={styles.venue}>{gig.venue && gig.venue.name}</div>
	</ListItem>
}

export default class Lineup extends React.Component {
	state = {
		tickets: [],
		dates: [],
		loading: true,
	}
	componentWillMount() {
		app.authenticate().then(this.fetchData)
	}
	fetchData = () => {
		const status = this.props.status || 'Attending'
		app.service('tickets').find({query: {status}})
		.then(result => {
			
			// if(result.total) {
				// console.log("Teekets:", result)
				const formated = result.data.map(t => moment(t.gig.start).format('YYYY-MM-DD'))
				// console.log("Formated", formated)
				const unique = formated.filter((e, i, a) => a.indexOf(e)===i)
				// console.log("Unique", unique)
				const sorted = unique.sort()
				const dates = sorted.map(s => moment(s, 'YYYY-MM-DD'))
								// a little hacky format -> parse but
								// works better than 0-ing time
				// console.log("Dates", dates)
				this.setState({tickets: result.data, dates, loading: false})
			// } 
		})
		.catch(err => console.error)
	}

	select = gig => {
		browserHistory.push('/gigs/' + gig._id)
	}

	render() {
		const { dates, tickets, loading } = this.state
		// console.log("LINEUP", this.state) 
		// console.log(dates)
		return <div>
			{ loading && <CircularProgress />}
			{ !loading && tickets.length==0 ?
				<Subheader>No events found. <Link to='/events'>Choose some</Link></Subheader> 
				: ''
			}
			{dates.map(d =>
				<List key={d}>
					<Subheader style={styles.date}>{d.format('MMM D, dddd')}</Subheader>
					<Divider/>
					{tickets.filter(t => moment(t.gig.start).isSame(d, 'day'))
						.sort((a, b) => +(a.gig.start > b.gig.start) || +(a.gig.start === b.gig.start) - 1)
						.map(({gig}) => 
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