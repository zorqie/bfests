import app from '../main.jsx'
import {browserHistory} from 'react-router'

export function viewGig(gig) {
	browserHistory.push('/gig/' + gig._id)
}

export function viewAct(act) {
	browserHistory.push('/acts/' + act._id)
}

export function isAttending(gig, tickets, status='Attending') {
	return tickets && tickets[gig._id] === status
}

export const gigJoin = (gig, status='Attending') => {
		const start = performance.now()
		const ticket = {gig_id: gig._id, status}
		app.service('tickets').create(ticket)
		.then(t => console.log(t, "Created in ", performance.now() - start))
		.catch(err => {
			app.emit('error', err)
			console.error("What could be wrong", err)
			console.error("This", JSON.stringify(err))
		})
	}

export const gigLeave = (gig, status='Attending') => {
		// TODO ensure status is string
		app.service('tickets')
		.remove(null, {
			query: {
				gig_id: gig._id, 
				owner_id: app.get('user')._id,
				status
			}
		})
		.catch(err => {
			app.emit('error', err)
			console.error("What could be wrong", err)
			console.error("This", JSON.stringify(err))
		})
	}
