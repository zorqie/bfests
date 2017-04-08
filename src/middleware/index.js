'use strict';

const handler = require('feathers-errors/handler');
const notFound = require('./not-found-handler');
const logger = require('./logger');
const winston = require('winston');
const signup = require('./signup')

module.exports = function() {
	// Add your custom middleware here. Remember, that
	// just like Express the order matters, so error
	// handling middleware should go last.
	const app = this;
	app.use(signup(app))

	app.use(notFound());
	app.use(logger(app));
	app.use(handler());
};
