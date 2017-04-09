'use strict';

const globalHooks = require('../../../hooks');
// const hooks = require('feathers-hooks');
const hooks = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;
const updateAttendance = require('./update-gig-hook')

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
	remove: [/*
	Can't use this because we use remove(null, {params}) and hook requires remove(id, ...)
	auth.restrictToRoles({
        roles: ['sysadmin'],
        ownerField: 'owner_id',
        owner: true
    })*/]
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

const popGig = hooks.populate('gig', {
			service: 'gigs',
			field: 'gig_id'  
		})

exports.after = {
	all: [hooks.remove('createdAt', 'updatedAt')],
	find: [
		// hooks.populate({schema})
		popGig
	],
	get: [
		hooks.remove('createdAt', 'updatedAt'),
		popGig
	],
	create: [updateAttendance(), popGig],
	update: [],
	patch: [],
	remove: [updateAttendance()]
};
