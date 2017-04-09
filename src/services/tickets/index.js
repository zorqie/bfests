'use strict';

const service = require('feathers-mongoose');
const Ticket = require('./ticket-model');
const hooks = require('./hooks');

module.exports = function() {
	const app = this;

	const options = {
		Model: Ticket,
		paginate: {
		  default: 5000,
		  max: 250000
		},
		lean: true
	};

	// Initialize our service with any options it requires
	app.use('/tickets', service(options));

	// Get our initialize service to that we can bind hooks
	const ticketsService = app.service('/tickets');

	// Set up our before hooks
	ticketsService.before(hooks.before);

	// Set up our after hooks
	ticketsService.after(hooks.after);
};
