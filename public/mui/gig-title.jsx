import React from 'react'
import { Link } from 'react-router'

export default function GigTitle({gig}) {
	return <span>
		<span className='gig-acts'>
			{gig.acts && gig.acts.map((act,i,a) => 
				<span><Link key={act._id} to={'/acts/'+act._id}>{act.name}</Link>{i==a.length-1 ? '':', '}</span>
			)}
		</span>
		{gig.venue && <span> at the <Link to={'/sites/' + gig.venue._id} className='gig-venue'>{gig.venue.name}</Link></span>}
	</span>
}