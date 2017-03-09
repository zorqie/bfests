'use strict';

const path = require('path');
const serveStatic = require('feathers').static;
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const socketio = require('feathers-socketio');
const middleware = require('./middleware');
const services = require('./services');

const mongoose = require('mongoose');

const gypsing = function (request, response, next){
  // console.log("Routing ", request.originalUrl);
  // console.log("Nexting ", next);
  if(request.originalUrl.indexOf('.') < 0) {
    response.sendFile(path.resolve(__dirname, app.get('public') + '/gyps/', 'index.html'))
  } else {
    next();
  }
};

const app = feathers();

app.configure(configuration(path.join(__dirname, '..')));

mongoose.Promise = global.Promise;
mongoose.connect(app.get('mongoose'));

app.use(compress())
  .options('*', cors())
  .use(cors())
  // .use(favicon( path.join(app.get('public'), 'favicon.ico') ))
  .use('/gyps/*', gypsing)
  .use('/', serveStatic( app.get('public') ))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(services)
  .configure(middleware);

module.exports = app;
