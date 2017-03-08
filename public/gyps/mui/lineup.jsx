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
		app.service('tickets').find()
		.then(result => {
			if(result.total) {
				const dates = result.data
								.map(t => moment(t.gig.start).format('YYYY-MM-DD'))
								.filter((e, i, a) => a.indexOf(e)===i)
								.map(s => moment(s, 'YYYY-MM-DD'))
								// a little hacky format -> parse but
								// works better than 0-ing time
				// console.log("Dates", dates)
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
					t => <ListItem
							key={t._id}
							primaryText={t.gig.name}
							secondaryText={<GigTimespan gig={t.gig} hideDates={true} />}
							onTouchTap={this.select.bind(this, t)}
						/>
				)}
			</List>
			)}
		</div>
	}
}