'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
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
  create: [],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
