import React from 'react'

import { ListItem } from 'material-ui/List'

import GigTimespan from './gig-timespan.jsx'
import styles from './styles'

export default function LineupItem({gig, onSelect, hideDates, ...others}) {
	return <ListItem
				onTouchTap={onSelect.bind(null, gig)}
				{...others}
				style={styles.lineup.item}
			>
			<div style={styles.lineup.time}>
				<GigTimespan gig={gig} hideDates={hideDates} />
			</div>
			<div style={styles.lineup.gig}>
				<div style={styles.lineup.name}>{gig.name}</div>
				<div style={styles.lineup.acts}>{gig.acts && gig.acts.map(a=>a.name).join(', ')}</div>
			</div>
			<div style={styles.lineup.venue}>{gig.venue && gig.venue.name}</div>
	</ListItem>
}