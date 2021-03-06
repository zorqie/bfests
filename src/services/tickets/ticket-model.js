'use strict';

// tickets-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const TicketSchema = new Schema({
	_id: 		{ type: String, 'default': shortid.generate},
	owner_id: 	{ type: String, ref: 'User' },
	gig_id: 	{ type: String, ref: 'Gig', required: true },
	status:		{ type: String, required: true},
	comment:	String,

	createdAt: { type: Date, 'default': Date.now },
	updatedAt: { type: Date, 'default': Date.now }
});

const TicketModel = mongoose.model('tickets', TicketSchema);

module.exports = TicketModel;