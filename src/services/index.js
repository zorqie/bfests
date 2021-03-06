'use strict';
const tickets = require('./tickets');
const fans = require('./fans');
const gig = require('./gig');
const act = require('./act');
const venue = require('./venue');
const message = require('./message');
const authentication = require('./authentication');
const user = require('./user');

module.exports = function() {
  const app = this;


  app.configure(authentication);
  app.configure(user);
  app.configure(message);
  app.configure(venue);
  app.configure(act);
  app.configure(gig);
  app.configure(tickets);
  app.configure(fans); // read-only view of tickets
};
