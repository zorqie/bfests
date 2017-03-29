'use strict';

// gig-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const gigSchema = new Schema({
	_id:		{ type: String, 'default': shortid.generate},
	name: 		{ type: String, required: true },
	description:{ type: String },
	info: 		{ type: [Schema.Types.Mixed] },
	type: 		{ type: String, required: true },
	capacity: 	{ type: Number},
	public: 	{ type: Boolean, 'default': false },
	mandatory: 	{ type: Boolean },
	start: 		{ type: Date, required: true},
	end:   		{ type: Date },
	
	poster_uri: {type: String},
	avatar_uri: {type: String},

	parent:   { type: String, ref: 'Gig' },
	venue_id: { type: String, ref: 'Venue' },
	act_id:   { type: [String], ref: 'Act' },

	owner: 		{ type: String, ref: 'User' } 
	// TODO this is currently and likely to remain unused
	// ,
	// createdAt: { type: Date, 'default': Date.now },
	// updatedAt: { type: Date, 'default': Date.now }
});

const gigModel = mongoose.model('gig', gigSchema);

module.exports = gigModel;