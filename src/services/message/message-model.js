'use strict';

// User-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	body: { type: String, required: true },
	from: { type: String, required: true },
	to:   { type: String, 'default': 'all' },
	createdAt: { type: Date, 'default': Date.now },
	updatedAt: { type: Date, 'default': Date.now }
});

const MessageModel = mongoose.model('Message', MessageSchema);

module.exports = MessageModel;