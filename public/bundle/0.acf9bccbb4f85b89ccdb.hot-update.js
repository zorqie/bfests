webpackHotUpdate(0,{

/***/ 26:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(24);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = __webpack_require__(21);

var _shortid = __webpack_require__(463);

var _shortid2 = _interopRequireDefault(_shortid);

var _routes = __webpack_require__(465);

var _routes2 = _interopRequireDefault(_routes);

var _reactTapEventPlugin = __webpack_require__(462);

var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _reactTapEventPlugin2.default)();

// touchy-screen stuff 


var feathers = __webpack_require__(461);
var auth = __webpack_require__(458);
var socketio = __webpack_require__(460);
var hooks = __webpack_require__(459);
var io = __webpack_require__(464);

// FIXME this should be in configuration somewhere.
// Establish a Socket.io connection
// const socket = io('http://localhost:2017');
var socket = io('https://fathomless-gorge-78924.herokuapp.com/');
// Initialize our Feathers client application through Socket.io
// with hooks and authentication.
var app = feathers().configure(socketio(socket)).configure(hooks())
// Use localStorage to store our login token
.configure(auth({ storage: window.localStorage }));

var Home = function Home() {
	return _react2.default.createElement(
		'p',
		null,
		'We\'re home'
	);
};
var NotFound = function NotFound() {
	return _react2.default.createElement(
		'div',
		{ style: { color: 'red' } },
		_react2.default.createElement(
			'h2',
			null,
			'She\'s not here.'
		)
	);
};

// const handleRouteChange = (prevState, nextState, replace, callback) => {
// 	// console.log("APP: ", app);
// 	console.log("Previous state: ", prevState);
// 	if("/login" === prevState.location.pathname) {

// 	}
// 	console.log("Nextious state: ", nextState);
// 	// console.log("Replace: ", replace);
// 	console.log("callback: ", callback); 
// 	callback();
// }

// const handleRouteEnter = (nextState, replace, callback) => {
// 	console.log("Entering ", nextState);
// 	// console.log("Replacing ", replace);
// 	callback();
// }

// const onEventEnter = (nextState, replace, callback) => {
// 	console.log("Entering", nextState)
// 	callback()
// if(nextState.location.action!=='REPLACE') {
// 	// not already replaced

// 	const {eventId} = nextState.params
// 	app.service('tickets').find({query: { gig_id: eventId }})
// 	.then(result => {
// 		console.log("Pass it", result)
// 		if(result.total == 0) {
// 			console.log("we don't even know you")
// 			replace({pathname: '/gyps/events'})
// 			callback()
// 		} else {
// 			const pass = result.data[0].status
// 			const level = access.indexOf(pass)
// 			console.log("Passed", pass)
// 			switch(pass) {
// 				case 'Registered':
// 					replace({pathname: '/gyps/volunteer/' + eventId})
// 					console.log("Replaced, now what")
// 					callback()
// 					break;
// 			}

// 		}
// 	})
// 	.catch(err => console.error("No pasaran", err))
// } else {
// 	callback()
// }
// }


/*export const routes = <Router history={browserHistory}>
					<Route path='/' component={Layout}>
						<Route path='login' component={LoginForm} />
						<Route path='signup' component={SignupForm} />
					</Route>
					<Route path="/gyps/" component={Layout}  >
						<IndexRoute component={Home} />

						
						<Route path='acts/:actId' component={ActDetailsPage} />
						
						<Route path='events' component={EventsList} />
						<Route path='events/:eventId' component={EventPage} />
						<Route path='volunteer/:eventId' component={EventVolunteerPage} />
						<Route path='train/:eventId' component={EventTrainPage} />
						<Route path='eventinfo/:eventId' component={EventInfo} />

						<Route path='lineup' component={Lineup} />
						<Route path='tasks' component={Tasks} />

						<Route path='gig/:gigId' component={GigDetailsPage} />
						
						<Route path='*' component={NotFound} />
					</Route>
					
				</Router>;*/

// FIXME hack to make app available to pages when not going through / first
app.authenticate().then(function () {
	_reactDom2.default.render(_routes2.default, document.getElementById("gyps"));
}).catch(function (error) {
	_reactDom2.default.render(_routes2.default, document.getElementById("gyps"));
	console.error("Not authenticated.", error);
});

// socket.io.engine.on('upgrade', function(transport) {
//     console.log('transport changed');
//     app.authenticate();
//   });

// FIXME remove this!!!
window.gyps = app;
window.ShortId = _shortid2.default;

exports.default = app;

/***/ })

})