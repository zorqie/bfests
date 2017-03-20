webpackHotUpdate(0,{

/***/ 223:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(21);

var _moment = __webpack_require__(0);

var _moment2 = _interopRequireDefault(_moment);

var _CircularProgress = __webpack_require__(890);

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

var _List = __webpack_require__(37);

var _Subheader = __webpack_require__(59);

var _Subheader2 = _interopRequireDefault(_Subheader);

var _Divider = __webpack_require__(74);

var _Divider2 = _interopRequireDefault(_Divider);

var _gigListItem = __webpack_require__(141);

var _gigListItem2 = _interopRequireDefault(_gigListItem);

var _main = __webpack_require__(26);

var _main2 = _interopRequireDefault(_main);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var styles = {
	date: {
		fontFamily: 'Roboto, sans-serif',
		fontWeight: 300,
		fontSize: '24px'
	}
};

var Lineup = function (_React$Component) {
	_inherits(Lineup, _React$Component);

	function Lineup() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, Lineup);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Lineup.__proto__ || Object.getPrototypeOf(Lineup)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
			tickets: [],
			dates: [],
			loading: true
		}, _this.fetchData = function () {
			var status = _this.props.route && _this.props.route.status || 'Attending';
			_main2.default.service('tickets').find({ query: { status: status } }).then(function (result) {

				// if(result.total) {
				// console.log("Teekets:", result)
				var formated = result.data.map(function (t) {
					return (0, _moment2.default)(t.gig.start).format('YYYY-MM-DD');
				});
				// console.log("Formated", formated)
				var unique = formated.filter(function (e, i, a) {
					return a.indexOf(e) === i;
				});
				// console.log("Unique", unique)
				var sorted = unique.sort();
				var dates = sorted.map(function (s) {
					return (0, _moment2.default)(s, 'YYYY-MM-DD');
				});
				// a little hacky format -> parse but
				// works better than 0-ing time
				// console.log("Dates", dates)
				_this.setState({ tickets: result.data, dates: dates, loading: false });
				// } 
			}).catch(function (err) {
				return console.error;
			});
		}, _this.select = function (gig) {
			_reactRouter.browserHistory.push('/gigs/' + gig._id);
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(Lineup, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			_main2.default.authenticate().then(this.fetchData);
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var _state = this.state,
			    dates = _state.dates,
			    tickets = _state.tickets,
			    loading = _state.loading;
			// console.log("LINEUP", this.state) 
			// console.log(dates)

			return _react2.default.createElement(
				'div',
				null,
				loading && _react2.default.createElement(_CircularProgress2.default, null),
				!loading && tickets.length == 0 ? _react2.default.createElement(
					_Subheader2.default,
					null,
					'You haven\'t joined any events. ',
					_react2.default.createElement(
						_reactRouter.Link,
						{ to: '/events' },
						'Choose some'
					)
				) : '',
				dates.map(function (d) {
					return _react2.default.createElement(
						_List.List,
						{ key: d },
						_react2.default.createElement(
							_Subheader2.default,
							{ style: styles.date },
							d.format('MMM D, dddd')
						),
						_react2.default.createElement(_Divider2.default, null),
						tickets.filter(function (t) {
							return (0, _moment2.default)(t.gig.start).isSame(d, 'day');
						}).map(function (_ref2) {
							var gig = _ref2.gig;
							return _react2.default.createElement(_gigListItem2.default, {
								key: gig._id,
								gig: gig,
								hideDates: true,
								onSelect: _this2.select.bind(_this2, gig)
							});
						})
					);
				})
			);
		}
	}]);

	return Lineup;
}(_react2.default.Component);

exports.default = Lineup;

/***/ }),

/***/ 226:
false,

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
var socket = io('http://localhost:2017');
// const socket = io('https://fathomless-gorge-78924.herokuapp.com/'); 
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

/***/ }),

/***/ 465:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.routes = undefined;

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(24);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _reactRouter = __webpack_require__(21);

var _layout = __webpack_require__(222);

var _layout2 = _interopRequireDefault(_layout);

var _loginForm = __webpack_require__(224);

var _loginForm2 = _interopRequireDefault(_loginForm);

var _signupForm = __webpack_require__(225);

var _signupForm2 = _interopRequireDefault(_signupForm);

var _actDetailsPage = __webpack_require__(217);

var _actDetailsPage2 = _interopRequireDefault(_actDetailsPage);

var _eventsList = __webpack_require__(221);

var _eventsList2 = _interopRequireDefault(_eventsList);

var _eventPage = __webpack_require__(219);

var _eventPage2 = _interopRequireDefault(_eventPage);

var _eventVolunteerPage = __webpack_require__(220);

var _eventVolunteerPage2 = _interopRequireDefault(_eventVolunteerPage);

var _eventInfo = __webpack_require__(218);

var _eventInfo2 = _interopRequireDefault(_eventInfo);

var _gigDetailsPage = __webpack_require__(100);

var _gigDetailsPage2 = _interopRequireDefault(_gigDetailsPage);

var _lineup = __webpack_require__(223);

var _lineup2 = _interopRequireDefault(_lineup);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Home = function Home() {
	return _react2.default.createElement(
		'div',
		{ style: { textAlign: 'center', margin: '3em' } },
		_react2.default.createElement(
			'h2',
			null,
			'Europa Roots - A Bulgarian Spring Project'
		),
		_react2.default.createElement(
			'p',
			null,
			'For more information follow the rumors.'
		)
	);
};

var NotFound = function NotFound() {
	return _react2.default.createElement(
		'div',
		{ style: { color: 'red', textAlign: 'center', margin: '3em' } },
		_react2.default.createElement(
			'h2',
			null,
			'She\'s not here.'
		)
	);
};

var routes = exports.routes = _react2.default.createElement(
	_reactRouter.Router,
	{ history: _reactRouter.browserHistory },
	_react2.default.createElement(
		_reactRouter.Route,
		{ path: '/', component: _layout2.default },
		_react2.default.createElement(_reactRouter.IndexRoute, { component: Home }),
		_react2.default.createElement(_reactRouter.Route, { path: 'login', component: _loginForm2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'signup', component: _signupForm2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'acts/:actId', component: _actDetailsPage2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'events', component: _eventsList2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'events/:eventId', component: _eventPage2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'volunteer/:eventId', component: _eventVolunteerPage2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'train/:eventId', component: _eventVolunteerPage2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'eventinfo/:eventId', component: _eventInfo2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'lineup', component: _lineup2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'tasks', component: _lineup2.default, status: 'Volunteering' }),
		_react2.default.createElement(_reactRouter.Route, { path: 'gigs/:gigId', component: _gigDetailsPage2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: '*', component: NotFound })
	)
);

exports.default = routes;

/***/ })

})