'use strict';

const service = require('feathers-mongoose');
const Ticket = require('../tickets/ticket-model');
const hooks = require('./hooks');

module.exports = function() {
  const app = this;

  const options = {
    Model: Ticket,
    paginate: {
      default: 10,
      max: 250
    },
    lean: true
  };

  // Initialize our service with any options it requires
  app.use('/fans', service(options));

  // Get our initialize service to that we can bind hooks
  const fansService = app.service('/fans');

  // Set up our before hooks
  fansService.before(hooks.before);

  // Set up our after hooks
  fansService.after(hooks.after);
};
