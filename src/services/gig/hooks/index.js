'use strict';

// const ticketHook = require('./ticket-hook');
// const hooks = require('feathers-hooks');
const hooks = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;

exports.before = {
  all: [
    // auth.verifyToken(),
    // auth.populateUser(),
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

const schema = {
  service: 'gigs',
  include: [{
      service: 'acts',
      nameAs: 'acts',
      asArray: true,
      parentField: 'act_id',
      childField: '_id',
    },
    {
      service: 'venues',
      nameAs: 'venue',
      parentField: 'venue_id',
      childField: '_id',
    }
  ]  
}

exports.after = {
  all: [],
  find: [
    hooks.populate({schema})
  ],
  get: [
    hooks.populate({schema})
  ],
  create: [],
  update: [],
  patch: [],
  remove: []
};
