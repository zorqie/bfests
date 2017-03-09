import app from '../main.jsx'

export const gigJoin = (gig, status='Attending') => {
		console.log("Joining gig", gig)
		app.service('tickets').create({gig_id: gig._id, status})
	}

export const gigLeave = gig => {
		console.log("Leaving gig", gig)
		app.service('tickets')
		.remove(null, {
			query: {
				gig_id: gig._id, 
				status: "Attending"
			}
		})
	}
