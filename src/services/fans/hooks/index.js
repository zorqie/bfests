'use strict';

const globalHooks = require('../../../hooks');
// const hooks = require('feathers-hooks');
const hooks = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;
const errors = require('feathers-errors');

const refuse = hook => {throw new errors.MethodNotAllowed('Such behavior will not be tolerated.')}

exports.before = {
	all: [
		auth.verifyToken(),
		auth.populateUser(),
		auth.restrictToAuthenticated()
	],
	find: [],
	get: [],
	create: [refuse],
	update: [],
	patch: [],
	remove: [refuse]
};

// THIS DOESN'T work on client unless lean:true
const schema = {
	service: 'fans',
	include: [{
		service: 'users',
		nameAs: 'user',
		parentField: 'owner_id',
		childField: '_id'
	}]	
}

exports.after = {
	all: [],
	find: [
		// hooks.populate('user', { service: 'users', field: 'owner_id'}),
		hooks.populate({schema}),
		hooks.remove('createdAt', 'updatedAt', 'user._id'),
	],
	get: [
		hooks.remove('createdAt', 'updatedAt'),
		// hooks.populate('gig', {
		// 	service: 'gigs',
		// 	field: 'gig_id'  
		// })
	],
	create: [],
	update: [],
	patch: [],
	remove: []
};
