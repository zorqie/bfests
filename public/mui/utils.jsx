import app from '../main.jsx'

export const gigJoin = (gig, status='Attending') => {
		const ticket = {gig_id: gig._id, status}
		app.service('tickets').create(ticket)
		.catch(err=>{
			console.error("What could be wrong", err)
			console.error("This", JSON.stringify(err))
		})
	}

export const gigLeave = (gig, status='Attending') => {
		// console.log("Util: Leaving gig", gig)
		// TODO ensure status is string
		app.service('tickets')
		.remove(null, {
			query: {
				gig_id: gig._id, 
				status
			}
		})
	}