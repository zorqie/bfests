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
	facebookId: { type: String },
	facebook:	{ type: Schema.Types.Mixed },
	instagramId: { type: String },
	instagram:	{ type: Schema.Types.Mixed },
	email: 		{ type: String },
	password: 	{ type: String },
	name: 		{ type: String  },
	online: 	{ type: Boolean, 'default': false },
	roles: 		[String]
	/*
	createdAt: 	{ type: Date, 'default': Date.now },
	updatedAt: 	{ type: Date, 'default': Date.now }
	*/
});

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;