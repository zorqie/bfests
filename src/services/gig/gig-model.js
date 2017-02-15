'use strict';

// gig-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const gigSchema = new Schema({
  name: 		{ type: String, required: true },
  description: 	{ type: String },
  type: 		{ type: String, required: true },
  public: 		{ type: Boolean, 'default': false },
  start: 		{ type: Date, required: true},
  end:   		{ type: Date, required: true},
  venue: 		{ type: Schema.Types.ObjectId, ref: 'Venue' },
  owner: 		{ type: Schema.Types.ObjectId, ref: 'User' },

  createdAt: { type: Date, 'default': Date.now },
  updatedAt: { type: Date, 'default': Date.now }
});

const gigModel = mongoose.model('gig', gigSchema);

module.exports = gigModel;