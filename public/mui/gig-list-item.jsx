import React from 'react'

import { ListItem } from 'material-ui/List'

import GigTimespan from './gig-timespan.jsx'

export default function GigListItem({gig, onSelect, hideDates, ...others}) {
	return <ListItem
				primaryText={gig.name}
				secondaryText={<GigTimespan gig={gig} hideDates={hideDates} />}
				onTouchTap={onSelect.bind(null, gig)}
				{...others}
			/>
}