'use strict';

const authentication = require('feathers-authentication');

const FacebookStrategy = require('passport-facebook').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const PaypalStrategy = require('passport-paypal-oauth').Strategy;
const PaypalTokenStrategy = require('passport-paypal-token');

module.exports = function() {
  const app = this;

  let config = app.get('auth');
  
  config.facebook.strategy = FacebookStrategy;
  config.facebook.tokenStrategy = FacebookTokenStrategy;
  config.google.strategy = GoogleStrategy;
  config.google.tokenStrategy = GoogleTokenStrategy; 
  config.paypal.strategy = PaypalStrategy;
  config.paypal.tokenStrategy = PaypalTokenStrategy;

  app.set('auth', config);
  app.configure(authentication(config));

  // const token = app.service('auth/token');
  // token.after({
  //   all: hook => console.log(hook.method, ' >>> \n', hook.params)
  // })

  const fb = app.service('auth/facebook');
  fb.after({
    get: hook => {
      console.log(">--FB------------------------->", hook.result)
      return Promise.resolve(
          hook.app.service('users').patch(hook.result.data._id, {online: true})
        )
        .then(() => hook)

    }
  })

};
