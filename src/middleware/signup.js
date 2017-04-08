'use strict';

const UserModel = require('../services/user/user-model')
const errors = require('feathers-errors');
	
module.exports = function(app) {
  return function(req, res, next) {
	/*
	const { email, password, name } = req.body;
	app.service('users').create({
		email,
		password,
		name,
	})
	.then(user => res.redirect('/login'))
	.catch(next);
	*/
	// Perform actions
	const body = req.body;
	UserModel.find({email: body.email}).then(result => {
		if(result.total) {
			next(new errors.NotAcceptable('Email already in use.'));
		} else {
			app.service('users').create({
				email: body.email,
				password: body.password,
				name: body.name
			})
			.then(user => res.redirect('/login'))
			.catch(next);
			
		}
	})
	// next();
  };
};
