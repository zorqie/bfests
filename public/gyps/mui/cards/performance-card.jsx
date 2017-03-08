import React from 'react'

import Divider from 'material-ui/Divider'

import ActsList from '../acts-list.jsx'

const PerformanceCard = ({gig, onPerformerEdit, onPerformerDelete, onPerformerSelect}) => 
	<div>
		<h2>{gig.name}</h2>
		<h3>{gig.description}</h3>
		<Divider style={{marginTop: '1em'}}/>
		{gig.acts && gig.acts.length ?
			<div>
				Featuring: 
				<ActsList 
					acts={gig.acts} 
					onSelect={onPerformerSelect}
					onEdit={onPerformerEdit}
					onDelete={onPerformerDelete}
				/>
			</div>
			: ''
		}
	</div>

export default PerformanceCard