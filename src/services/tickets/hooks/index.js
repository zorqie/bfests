'use strict';

const globalHooks = require('../../../hooks');
// const hooks = require('feathers-hooks');
const hooks = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;
const updateAttendance = require('./update-gig-hook')

// THIS DOESN'T work on client unless lean:true
const schema = {
	service: 'tickets',
	include: [{
		service: 'gigs',
		nameAs: 'gig',
		parentField: 'gig_id',
		childField: '_id',
		include: [{
			service: 'venues',
			nameAs: 'venue',
			parentField: 'venue_id',
			childField: '_id'
		}]
	}]	
}



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

const debag = hook => {console.log(hook); return hook};

exports.after = {
	all: [hooks.remove('createdAt', 'updatedAt')],
	find: [
		// hooks.populate({schema})
		hooks.populate({schema})
	],
	get: [
		hooks.populate({schema})
	],
	create: [
		updateAttendance()
	],
	update: [],
	patch: [],
	remove: [updateAttendance()]
};
