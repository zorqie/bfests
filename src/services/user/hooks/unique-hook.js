'use strict';

const UserModel = require('../user-model')
const errors = require('feathers-errors');

function checkUnique(options) {
	// TODO make fields configurable
	return function(hook) {
		console.log("Hooking: ", hook.method)
		if(hook.method==='create' && hook.data.email) {
			// data is what we're trying to create			
			var data = hook.data
			return Promise.resolve(UserModel.count({email: data.email}))
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
			return hook
		}
	};
};

module.exports = checkUnique