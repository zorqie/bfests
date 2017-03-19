'use strict';

// User-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const shortid = require('shortid');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	_id: 		{ type: String, 'default': shortid.generate},
	email: 		{ type: String, required: true },
	password: 	{ type: String },
	name: 		{ type: String, required: true },
	online: 	{ type: Boolean, 'default': false },
	roles: 		[String]
	/*
	createdAt: 	{ type: Date, 'default': Date.now },
	updatedAt: 	{ type: Date, 'default': Date.now }
	*/
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;