'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks-common');
const auth = require('feathers-authentication').hooks;
const checkUnique = require('./unique-hook')

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
        roles: ['sysadmin', 'master', 'performer'],
        owner: true,
        ownerField: '_id'
    })
  ],
  create: [
    checkUnique(), 
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
    auth.restrictToAuthenticated(),
    // auth.restrictToOwner({ ownerField: '_id' })
    // allow only sysadmin and owner to modify
    auth.restrictToRoles({
        roles: ['sysadmin'],
        owner: true,
        ownerField: '_id'
    })
  ],
  remove: [
    auth.verifyToken(),
    auth.restrictToAuthenticated(),
    // auth.restrictToOwner({ ownerField: '_id' })
    auth.restrictToRoles({
        roles: ['sysadmin'],
        owner: true,
        ownerField: '_id'
    })
  ]
};

const schema = {
  service: 'users',
  include: [{
      service: 'acts',
      nameAs: 'acts',
      asArray: true,
      parentField: '_id',
      childField: 'user_id'
    }]
}

exports.after = {
  all: [hooks.remove('password', 'createdAt', 'updatedAt')],
  find: [],
  get: [hooks.populate({schema})],
  create: [],
  update: [],
  patch: [],
  remove: []
};
