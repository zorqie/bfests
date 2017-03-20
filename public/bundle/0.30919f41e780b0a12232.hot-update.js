webpackHotUpdate(0,{

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

var _tasks = __webpack_require__(226);

var _tasks2 = _interopRequireDefault(_tasks);

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
		_react2.default.createElement(_reactRouter.Route, { path: 'tasks', component: _tasks2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: 'gig/:gigId', component: _gigDetailsPage2.default }),
		_react2.default.createElement(_reactRouter.Route, { path: '*', component: NotFound })
	)
);

exports.default = routes;

/***/ })

})