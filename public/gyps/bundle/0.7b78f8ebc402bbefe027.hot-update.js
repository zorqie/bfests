webpackHotUpdate(0,{

/***/ 50:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(24);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = __webpack_require__(40);

var _layout = __webpack_require__(433);

var _layout2 = _interopRequireDefault(_layout);

var _loginForm = __webpack_require__(435);

var _loginForm2 = _interopRequireDefault(_loginForm);

var _signupForm = __webpack_require__(436);

var _signupForm2 = _interopRequireDefault(_signupForm);

var _eventsList = __webpack_require__(432);

var _eventsList2 = _interopRequireDefault(_eventsList);

var _eventPage = __webpack_require__(431);

var _eventPage2 = _interopRequireDefault(_eventPage);

var _gigPage = __webpack_require__(856);

var _gigPage2 = _interopRequireDefault(_gigPage);

var _lineup = __webpack_require__(434);

var _lineup2 = _interopRequireDefault(_lineup);

var _reactTapEventPlugin = __webpack_require__(429);

var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _reactTapEventPlugin2.default)();

// touchy-screen stuff 


var feathers = __webpack_require__(428);
var auth = __webpack_require__(425);
var socketio = __webpack_require__(427);
var hooks = __webpack_require__(426);
var io = __webpack_require__(430);

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

var handleRouteChange = function handleRouteChange(prevState, nextState, replace, callback) {
	// console.log("APP: ", app);
	console.log("Previous state: ", prevState);
	if ("/login" === prevState.location.pathname) {}
	console.log("Nextious state: ", nextState);
	// console.log("Replace: ", replace);
	console.log("callback: ", callback);
	callback();
};

var handleRouteEnter = function handleRouteEnter(nextState, replace, callback) {
	console.log("Entering ", nextState);
	// console.log("Replacing ", replace);
	callback();
};

var routes = _react2.default.createElement(
	_reactRouter.Router,
	{ history: _reactRouter.browserHistory },
	_react2.default.createElement(
		_reactRouter.Route,
		{ path: '/gyps', component: _layout2.default },
		_react2.default.createElement(_reactRouter.IndexRoute, { component: Home }),
		_react2.default.createElement(_reactRouter.Route, { path: '/login', component: _loginForm2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'signup', component: _signupForm2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'events', component: _eventsList2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'events/:eventId', component: _eventPage2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'lineup', component: _lineup2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'gig/:gigId', component: _gigPage2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: '*', component: NotFound })
	)
);

// FIXME hack to make app available to pages when not going through / first
app.authenticate().then(function () {
	_reactDom2.default.render(routes, document.getElementById("gyps"));
}).catch(function (error) {
	_reactDom2.default.render(routes, document.getElementById("gyps"));
	console.error("Not authenticated.", error);
});

// socket.io.engine.on('upgrade', function(transport) {
//     console.log('transport changed');
//     app.authenticate();
//   });

// FIXME remove this!!!
window.gyps = app;

exports.default = app;

/***/ })

})