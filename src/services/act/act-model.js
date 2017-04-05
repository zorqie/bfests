'use strict';

// act-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const ActSchema = new Schema({
	_id: 		{ type: String, 'default': shortid.generate},
	name:		{ type: String, required: '{PATH} is required!' },
	description: String,
	poster_uri: String,
	avatar_uri: String, 
	user_id:	{ type: String, ref: 'User' }
  // ,
  // createdAt: { type: Date, 'default': Date.now },
  // updatedAt: { type: Date, 'default': Date.now }
});

const ActModel = mongoose.model('act', ActSchema);

module.exports = ActModel;