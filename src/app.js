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

// const {routes} = require('../public/gyps/routes.jsx');
// const React = require('react');
// const { renderToString } = require('react-dom/server');
// const { match, RouterContext } = require('react-router');

const gypsing = function (request, response, next) {
  const url = request.originalUrl;
  if(url.indexOf('/auth') < 0 && url.indexOf('.') < 0) {
    console.log("Re-Routing ", request.originalUrl);
    return response.sendFile(path.resolve(__dirname, app.get('public') , 'index.html'))
  } else {
    // console.log("Nexting ", url);
    return next();
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
.get('/auth/success', (req, res, next) => {
  // console.log("\nZ\nZ\nZ\nZ\nZ\nZ\nZ\n\nNexting", next)
  next()
  // console.log("\n\n\n\n\n\n\n\n\nNexted", next)
  console.log("==== Response: ", res)
  res.sendFile(path.resolve(__dirname, app.get('public') , 'index.html'))
})
  .get('*', gypsing)
  .use('/', serveStatic( app.get('public') ))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(services)
  .configure(middleware);
// app.get('*', (req, res) => {
//   // match the routes to the url
//   match({ routes: routes, location: req.url }, (err, redirect, props) => {
//     // `RouterContext` is what the `Router` renders. `Router` keeps these
//     // `props` in its state as it listens to `browserHistory`. But on the
//     // server our app is stateless, so we need to use `match` to
//     // get these props before rendering.
//     const appHtml = renderToString(React.createElement("RouterContext", props))

//     // dump the HTML into a template, lots of ways to do this, but none are
//     // really influenced by React Router, so we're just using a little
//     // function, `renderPage`
//     res.send(renderPage(appHtml))
//   })
// })

// function renderPage(appHtml) {
//   return `
//     <!doctype html public="storage">
//     <html>
//     <meta charset="utf-8" />
//     <title>BFest Router App</title>

//     <link rel="shortcut icon" href="/img/favicon.ico" />
//     <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&amp;subset=cyrillic" rel="stylesheet" />
//     <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
//     <link rel="stylesheet" href="/gyps/bundle/main.css" />
//     <div id="gyps">${appHtml}</div>
//     <script src="/gyps/bundle/main.js"></script>
//    `
// }

module.exports = app;
