import app from '../main.jsx'

export const gigJoin = gig => {
		console.log("Joining gig", gig)
		app.service('tickets').create({gig_id: gig._id, status: "Attending"})
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
