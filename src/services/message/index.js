'use strict';

const path = require('path');
const mongoose = require('mongoose');
const service = require('feathers-mongoose');
const hooks = require('./hooks');
const MessageModel = require('./message-model');

module.exports = function(){
  const app = this;

  let options = {
    Model: MessageModel,
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/messages', service(options));

  // Get our initialize service to that we can bind hooks
  const messageService = app.service('/messages');

  // Set up our before hooks
  messageService.before(hooks.before);

  // Set up our after hooks
  messageService.after(hooks.after);
};
