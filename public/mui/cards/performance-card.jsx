import React from 'react'

import Divider from 'material-ui/Divider'

import ActsList from '../acts-list.jsx'

function PerformanceCard({gig, onPerformerEdit, onPerformerDelete, onPerformerSelect}) { 
	return <div>
		<h2>{gig.name}</h2>
		<p style={{paddingTop:'0.75em'}}>{gig.description}</p>
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
}
export default PerformanceCard