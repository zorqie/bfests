'use strict';

// const ticketHook = require('./ticket-hook');
// const hooks = require('feathers-hooks');
const hooks = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;

exports.before = {
  all: [
    // auth.verifyToken(),
    auth.populateUser(),
    // auth.restrictToAuthenticated()
  ],
  find: [
    auth.verifyOrRestrict({restrict: {public: true}})
  ],
  get: [
    auth.verifyOrRestrict({restrict: {public: true}})
  ],
  create: [auth.verifyToken()],
  update: [auth.verifyToken()],
  patch: [auth.verifyToken()],
  remove: [auth.verifyToken()]
};

exports.after = {
  all: [],
  find: [],
  get: [
    hooks.populate('acts', {
      service: 'acts',
      field: 'act_id'  
    }),
    hooks.populate('venue', {
      service: 'venues',
      field: 'venue_id'  
    })
  ],
  create: [],
  update: [],
  patch: [],
  remove: []
};
