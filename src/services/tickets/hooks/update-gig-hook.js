'use strict';

const GigModel = require('../../gig/gig-model')

function updateAttendance(options) {
	// TODO add options
	return function(hook) {

		if(hook.method==='create') {
			const ticket = hook.result
			// result is a ticket object
			if (ticket.status==='Attending' || ticket.status==='Volunteering') {
			// TODO consider adding all tickets
			// perhaps in gig.tickets[status]=[_id,...]
				return Promise.resolve(
					hook.app.service('gigs').patch(ticket.gig_id, {
								$push: { 
									attending: ticket._id
								}
							})
					)
					.then(gig => hook)

				// return Promise.resolve(
				// 		GigModel.findByIdAndUpdate(result.gig_id, {
				// 			$push: {
				// 				attending: result._id
				// 			}
				// 		}, {new: true})
				// 	) //{new:true} returns updated object instead of original
				// 	.then(gig => {
				// 		// console.log("Attending => ", gig)
				// 		// this is a side effect
				// 		hook.app.service('gigs').emit('patched', gig)
						
				// 		return hook
				// 	}) 
			}
		} else if (hook.method==='remove') {
			// result is an array (!!!) of tickets
			return Promise.all(hook.result.map(t => 
						hook.app.service('gigs').patch(t.gig_id, {
							$pull: {
								attending: t._id
							}
						})
					)
				) 
				.then(updates => {
					// console.log("Updates => ", updates)
					return hook
				})
				.catch(err => console.error);

		} 
		
		// Not our problem
		return hook
	}
}

// TODO add options
module.exports = updateAttendance