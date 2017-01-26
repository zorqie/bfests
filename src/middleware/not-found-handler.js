'use strict';

const errors = require('feathers-errors');

module.exports = function() {
  return function(req, res, next) {
    next(new errors.NotFound('No such thing.'));
  };
};
