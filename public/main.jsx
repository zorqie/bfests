import React from 'react'
import ReactDOM from 'react-dom'
import { browserHistory } from 'react-router'
import routes from './routes.jsx'

// touchy-screen stuff 
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

const feathers = require('feathers/client')
const auth = require('feathers-authentication/client')
const socketio = require('feathers-socketio/client') 
const hooks = require('feathers-hooks')
const io = require('socket.io-client')

// FIXME this should be in configuration somewhere.
// Establish a Socket.io connection
// const socket = io('http://localhost:2017')
const socket = io('https://gyps.herokuapp.com/') 
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
	.configure(socketio(socket))
	.configure(hooks())
	// Use localStorage to store our login token
	.configure(auth({ storage: window.localStorage }))


// FIXME hack to make app available to pages when not going through / first
app.authenticate()
.then(() => {
	ReactDOM.render( routes, document.getElementById("gyps") )
})
.catch(error => {
	ReactDOM.render( routes, document.getElementById("gyps") )
	console.error("Not authenticated. Going home")
	browserHistory.replace('/events')
 })


// socket.io.engine.on('upgrade', function(transport) {
//     console.log('transport changed')
//     app.authenticate()
//   })

// FIXME remove this!!!
window.gyps = app

export default app

