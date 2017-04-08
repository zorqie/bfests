'use strict';

const GigModel = require('../../gig/gig-model')

function updateAttendance(options) {
	// TODO add options
	return function(hook) {
		var result = hook.result
		var params = hook.params

		if(hook.method==='create') {
			// result is a ticket object

			// TODO consider adding all tickets
			// perhaps in gig.tickets[status]=[_id,...]
			return result.status==='Attending'
				? Promise.resolve(
						GigModel.findByIdAndUpdate(result.gig_id, {
							$push: {
								attending: result._id
							}
						}, {new: true})
					) //{new:true} returns updated object instead of original
					.then(gig => {
						// console.log("Attending => ", gig)
						// this is a side effect
						// if(hook.result.toObject) {
						// 	// mongoose doc, convert toObject first
						// 	hook.result = Object.assign(hook.result.toObject(), {gig})
						// } else {
						// 	// never...
						// 	hook.result.gig = gig
						// }
						
						return hook
					}) 
				: hook

		} else if (hook.method==='remove') {
			// result is an array (!!!) of tickets
			return Promise.all(result.map(t => 
						GigModel.findByIdAndUpdate(t.gig_id, {
							$pullAll: {
								attending: [t._id]
							}
						}, {new: true})
						// .then(gig => null) // noop but we need it, otherwise it never executes
					)
				) 
				.then(updates => {
					// console.log("Updates => ", updates)
					return hook
				})
				.catch(err => console.error);

		} else {
			// Not our problem
			return hook
		}
	};
};

// TODO add options
module.exports = updateAttendance