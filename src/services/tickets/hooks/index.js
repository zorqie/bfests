'use strict';

const globalHooks = require('../../../hooks');
// const hooks = require('feathers-hooks');
const hooks = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;

exports.before = {
	all: [
		auth.verifyToken(),
		auth.populateUser(),
		auth.restrictToAuthenticated()
	],
	find: [auth.queryWithCurrentUser({ as: 'owner_id' })],
	get: [],
	create: [auth.associateCurrentUser({ as: 'owner_id' })],
	update: [auth.associateCurrentUser({ as: 'owner_id' })],
	patch: [auth.associateCurrentUser({ as: 'owner_id' })],
	remove: []
};

// THIS DOESN'T work on client, the old-style hook does.
const schema = {
	service: 'tickets',
	include: [{
		service: 'gigs',
		nameAs: 'gig',
		parentField: 'gig_id',
		childField: '_id',
		include: [{
			service: 'venues',
			parentField: 'venue',
			childField: '_id'
		}]
	}]	
}

exports.after = {
	all: [],
	find: [
		hooks.remove('createdAt', 'updatedAt'),
		// hooks.populate({schema})
		hooks.populate('gig', {
			service: 'gigs',
			field: 'gig_id'  
		})
	],
	get: [
		hooks.remove('createdAt', 'updatedAt'),
		hooks.populate('gig', {
			service: 'gigs',
			field: 'gig_id'  
		})
	],
	create: [],
	update: [],
	patch: [],
	remove: []
};
