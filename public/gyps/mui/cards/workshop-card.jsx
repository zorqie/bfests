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
	leave: {
		margin: '1em',
		border: '2px solid grey'
	}
}

const WorkshopCard = ({gig, acts, fans, ticket, onMasterSelect}) => <div>
	<span style={styles.gigType}>{gig.type}</span>
	<h2>{gig.name}</h2>
	<p>{gig.description}</p>
	<Divider style={{marginTop:'1em'}} />
		Taught by: 
	{gig.acts && gig.acts.length ?
		<ActsList 
			acts={gig.acts} 
			onSelect={onMasterSelect}
		/>
		: ' Unknown master'
	}
</div>

export default WorkshopCard