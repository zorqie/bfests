'use strict';

const UserModel = require('../user-model')
const errors = require('feathers-errors');

function checkUnique(options) {
	// TODO make fields configurable
	return function(hook) {
		console.log("Hooking: ", hook.method)
		if(hook.method==='create') {
			// data is what we're trying to create			
			var data = hook.data
			return Promise.resolve().then(() => UserModel.count({email: data.email}))
				.then(c => {
					if(c > 0) {
						throw new errors.NotAcceptable({
							errors: {email: 'Email already in use.'}
						})
					} else {
						return hook
					}
				}); 
		
		} else {
			var query = params.query
			console.log("We shouldn't be hooking here", query)
			return hook
		}
	};
};

module.exports = checkUnique