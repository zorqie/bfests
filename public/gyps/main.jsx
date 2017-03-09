import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router'

import Layout from './mui/layout.jsx'

import LoginForm from './mui/login-form.jsx'
import SignupForm from './mui/signup-form.jsx'

import ActDetailsPage from './mui/act-details-page.jsx'
import EventsList from './mui/events-list.jsx'
import EventPage from './mui/event-page.jsx'
import EventTrainPage from './mui/event-volunteer-page.jsx'
import EventVolunteerPage from './mui/event-volunteer-page.jsx'
import EventInfo from './mui/event-info.jsx'
import GigDetailsPage from './mui/gig-details-page.jsx'
import Lineup from './mui/lineup.jsx'
import Tasks from './mui/tasks.jsx'

// touchy-screen stuff 
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

const feathers = require('feathers/client');
const auth = require('feathers-authentication/client');
const socketio = require('feathers-socketio/client'); 
const hooks = require('feathers-hooks');
const io = require('socket.io-client');

// FIXME this should be in configuration somewhere.
// Establish a Socket.io connection
// const socket = io('http://localhost:2017');
const socket = io('https://fathomless-gorge-78924.herokuapp.com/'); 
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
const app = feathers()
	.configure(socketio(socket))
	.configure(hooks())
	// Use localStorage to store our login token
	.configure(auth({ storage: window.localStorage }));



const Home = () => <p>We're home</p>;
const NotFound = () => <div style={{color:'red'}}><h2>She's not here.</h2></div>;

const handleRouteChange = (prevState, nextState, replace, callback) => {
	// console.log("APP: ", app);
	console.log("Previous state: ", prevState);
	if("/login" === prevState.location.pathname) {

	}
	console.log("Nextious state: ", nextState);
	// console.log("Replace: ", replace);
	console.log("callback: ", callback); 
	callback();
}

const handleRouteEnter = (nextState, replace, callback) => {
	console.log("Entering ", nextState);
	// console.log("Replacing ", replace);
	callback();
}

const onEventEnter = (nextState, replace, callback) => {
	console.log("Entering", nextState)
	if(nextState.location.action!=='REPLACE') {
		// not already replaced

		const {eventId} = nextState.params
		app.service('tickets').find({query: { gig_id: eventId }})
		.then(result => {
			console.log("Pass it", result)
			if(result.total == 0) {
				console.log("we don't even know you")
				replace({pathname: 'events'})
			} else {
				const pass = result.data[0].status
				const level = access.indexOf(pass)
				console.log("Passed", pass)
				switch(pass) {
					case 'Registered':
						replace({pathname: '/gyps/volunteer/' + eventId})
						console.log("Replaced, now what")
						callback()
						break;
				}

			}
		})
		.catch(err => console.error("No pasaran", err))
	} else {
		callback()
	}
}

// TODO move this
export const access = [
	'Registered',
	'Volnteered',
	'Trained',
	'Paid',
	'Attending',
]

const paths = {
	'Registered': 'volunteer',
	'Volnteered': 'train',
	'Trained'	: 'payment',
	'Paid'		: 'attend',
	'Attending' : 'events',	
}
const routes = <Router history={browserHistory}>
					<Route path='/' component={Layout}>
						<Route path='login' component={LoginForm} />
						<Route path='signup' component={SignupForm} />
					</Route>
					<Route path="/gyps/" component={Layout}  >
						<IndexRoute component={Home} />

						
						<Route path='acts/:actId' component={ActDetailsPage} />
						
						<Route path='events' component={EventsList} />
						<Route path='events/:eventId' component={EventPage} onEnter={onEventEnter} />
						<Route path='volunteer/:eventId' component={EventVolunteerPage} onEnter={onEventEnter} />
						<Route path='train/:eventId' component={EventTrainPage} onEnter={onEventEnter} />
						<Route path='eventinfo/:eventId' component={EventInfo} />

						<Route path='lineup' component={Lineup} />
						<Route path='tasks' component={Tasks} />

						<Route path='gig/:gigId' component={GigDetailsPage} />
						{/*<Route path='venues' component={VenueForm} />
						<Route path='venues/:venueId' component={VenuePage} />

						<Route path='users' component={UserList} />*/}
						
						<Route path='*' component={NotFound} />
					</Route>
					
				</Router>;

// FIXME hack to make app available to pages when not going through / first
app.authenticate()
.then(() => {
	ReactDOM.render( routes, document.getElementById("gyps") );
})
.catch(error => {
	ReactDOM.render( routes, document.getElementById("gyps") );
	console.error("Not authenticated.", error);
 });


// socket.io.engine.on('upgrade', function(transport) {
//     console.log('transport changed');
//     app.authenticate();
//   });

// FIXME remove this!!!
window.gyps = app;

export default app;

