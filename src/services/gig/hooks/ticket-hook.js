'use strict';

const TicketModel = require('../../tickets/ticket-model')

function ticketHook(options) {
	return function(hook) {
		var result = hook.result
		var params = hook.params

		var user = params.user
		if(hook.method==='get') {
			// result is a gig object
		console.log('Hooking', hook.params);
			
			return Promise.resolve().then(() => TicketModel.count({gig_id: result._id}))
				.then(c => {
					hook.result.attending = c
					return hook
				}); 
		
		} else {
			console.log("RESULT", result)
			var query = params.query
			return hook
		}
	};
};

module.exports = ticketHook