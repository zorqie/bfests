'use strict';

const globalHooks = require('../../../hooks');
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
  get: [hooks.populate('acts', {
      service: 'acts',
      field: 'act_id'  
    })],
  create: [],
  update: [],
  patch: [],
  remove: []
};
