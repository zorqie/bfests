import React from 'react'

import Divider from 'material-ui/Divider'

import ActsList from '../acts-list.jsx'

const styles = {
	acts: {
		fontSize: '18dp',
		fontWeight: 300,
	},
	gigType: {
		fontSize: '12dp',
		fontWeight: '300',
		float: 'right'
	},
	divider: {
		marginTop:'1em', 
		marginBottom: '0.5em'
	},
}

const WorkshopCard = ({gig, acts, fans, ticket, onMasterSelect}) => <div>
	<span style={styles.gigType}>{gig.type}</span>
	<h2>{gig.name}</h2>
	<p>{gig.description}</p>
	<Divider style={styles.divider} />
		Led by: 
	{gig.acts && gig.acts.length ?
		<ActsList 
			acts={gig.acts} 
			onSelect={onMasterSelect}
		/>
		: ' Unknown master'
	}
</div>

export default WorkshopCard