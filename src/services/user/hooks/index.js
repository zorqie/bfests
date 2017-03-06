'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const auth = require('feathers-authentication').hooks;

exports.before = {
  all: [],
  find: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated()
  ],
  get: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    // auth.restrictToOwner({ ownerField: '_id' })
    auth.restrictToRoles({
        roles: ['sysadmin', 'master'],
        owner: true
    })
  ],
  create: [
    auth.hashPassword()
  ],
  update: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    auth.restrictToOwner({ ownerField: '_id' })
  ],
  patch: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    // auth.restrictToOwner({ ownerField: '_id' })
    // allow only sysadmin and owner to modify
    auth.restrictToRoles({
        roles: ['sysadmin'],
        owner: true
    })
  ],
  remove: [
    auth.verifyToken(),
    auth.populateUser(),
    auth.restrictToAuthenticated(),
    // auth.restrictToOwner({ ownerField: '_id' })
    auth.restrictToRoles({
        roles: ['sysadmin'],
        ownerField: '_id',
        owner: true
    })
  ]
};

exports.after = {
  all: [hooks.remove('password', 'createdAt', 'updatedAt')],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};
