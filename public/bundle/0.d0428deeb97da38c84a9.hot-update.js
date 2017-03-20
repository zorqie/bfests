webpackHotUpdate(0,{

/***/ 220:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(21);

var _Card = __webpack_require__(48);

var _Dialog = __webpack_require__(122);

var _Dialog2 = _interopRequireDefault(_Dialog);

var _FlatButton = __webpack_require__(30);

var _FlatButton2 = _interopRequireDefault(_FlatButton);

var _List = __webpack_require__(37);

var _Subheader = __webpack_require__(59);

var _Subheader2 = _interopRequireDefault(_Subheader);

var _Tabs = __webpack_require__(173);

var _gigDetailsPage = __webpack_require__(100);

var _gigDetailsPage2 = _interopRequireDefault(_gigDetailsPage);

var _gigTimespan = __webpack_require__(86);

var _gigTimespan2 = _interopRequireDefault(_gigTimespan);

var _eventActions = __webpack_require__(213);

var _eventActions2 = _interopRequireDefault(_eventActions);

var _main = __webpack_require__(26);

var _main2 = _interopRequireDefault(_main);

var _utils = __webpack_require__(87);

var _icons = __webpack_require__(215);

var _hacks = __webpack_require__(214);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var EventPage = function (_React$Component) {
	_inherits(EventPage, _React$Component);

	function EventPage() {
		var _ref;

		var _temp, _this, _ret;

		_classCallCheck(this, EventPage);

		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = EventPage.__proto__ || Object.getPrototypeOf(EventPage)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
			event: {},
			pass: {},
			gigs: [],
			tickets: {},
			ticketsRaw: [],
			dialog: {
				open: false,
				gig: {}
			}
		}, _this.fetchData = function () {
			var eventId = _this.props.params.eventId;

			_main2.default.service('gigs').get(eventId).then(function (event) {
				document.title = event.name;
				// app.service('tickets').find({query:{gig_id: event._id}})
				// .then(pass => {
				// 	if(access.indexOf(pass.status) <access.length-1) {

				// 	}
				// })
				_main2.default.service('gigs').find({
					query: {
						parent: eventId,
						type: 'Volunteer',
						$sort: { start: 1 }
					}
				}).then(function (page) {
					// console.log("Got result: ", page);			
					_this.setState(_extends({}, _this.state, { gigs: page.data, event: event }));
				});
			}).then(_this.fetchTickets).catch(function (err) {
				return console.error("ERAR: ", err);
			});
		}, _this.fetchTickets = function () {
			_main2.default.service('tickets').find().then(function (result) {
				// console.log("Got tickets", result)
				var tickets = result.data.reduce(function (o, t) {
					return Object.assign(o, _defineProperty({}, t.gig_id, t.status));
				}, {});
				var event = _this.state.event;

				console.log("Event", event);
				var passes = result.data.filter(function (t) {
					return t.gig_id === event._id;
				});
				console.log("PASSED", passes);
				if (event && passes.length) {
					Object.assign(event, { tickets: passes });
				}
				_this.setState(_extends({}, _this.state, { ticketsRaw: result.data.filter(function (t) {
						return t.status === 'Volunteering';
					}), event: event, tickets: tickets }));
			});
		}, _this.handleDialogCancel = function (e) {
			// console.log("Canceling...");
			_this.setState({ dialogOpen: false });
		}, _this.isVolunteering = function (gig) {
			return _this.state.tickets[gig._id] === "Volunteering";
		}, _this.handleGigJoin = function (gig) {
			_main2.default.service('gigs').find({ query: { parent: gig._id } }).then(function (result) {
				if (result.total) {
					// has children
					_this.viewGigDetails(gig);
				} else {
					console.log("Go join the gig");
					(0, _utils.gigJoin)(gig, 'Volunteering');
				}
			});
		}, _this.shiftJoin = function (gig) {
			(0, _utils.gigJoin)(gig, 'Volunteering');
		}, _this.shiftLeave = function (gig) {
			(0, _utils.gigLeave)(gig, 'Volunteering');
		}, _this.viewGigDetails = function (gig) {
			// browserHistory.push('/gig/'+gig._id)
			var dialog = _this.state.dialog;

			Object.assign(dialog, { open: true, gig: gig });
			_this.setState(_extends({}, _this.state, { dialog: dialog }));
		}, _this.ticketCreated = function (t) {
			console.log("Ticket created", t);
			var tickets = _this.state.tickets;

			Object.assign(tickets, _defineProperty({}, t.gig_id, t.status));
			_this.setState(_extends({}, _this.state, { tickets: tickets, ticketsRaw: _this.state.ticketsRaw.concat(t) }));
		}, _this.ticketRemoved = function (t) {
			console.log("Ticket removed", t);
			var tickets = _this.state.tickets;

			Object.assign(tickets, _defineProperty({}, t.gig_id, null));
			_this.setState(_extends({}, _this.state, { tickets: tickets, ticketsRaw: _this.state.ticketsRaw.filter(function (r) {
					return r._id !== t._id;
				}) }));
		}, _this.gigRemoved = function (gig) {
			// console.log("Removed: ", gig);
			_this.setState(_extends({}, _this.state, {
				gigs: _this.state.gigs.filter(function (g) {
					return g._id !== gig._id;
				})
			}));
		}, _this.gigCreated = function (gig) {
			// console.log("Added: ", gig);
			_this.setState(_extends({}, _this.state, {
				gigs: _this.state.gigs.concat(gig)
			}));
		}, _this.gigPatched = function (gig) {
			// console.log("Updated: ", gig);
			// do something to reflect update
			_this.fetchData();
		}, _this.dialogClose = function () {
			_this.setState(_extends({}, _this.state, { dialog: { open: false, gig: {} } }));
		}, _temp), _possibleConstructorReturn(_this, _ret);
	}

	_createClass(EventPage, [{
		key: 'componentWillMount',
		value: function componentWillMount() {
			_main2.default.authenticate().then(this.fetchData);
			_main2.default.service('gigs').on('removed', this.gigRemoved);
			_main2.default.service('gigs').on('created', this.gigCreated);
			_main2.default.service('gigs').on('patched', this.gigPatched);
			_main2.default.service('tickets').on('created', this.ticketCreated);
			_main2.default.service('tickets').on('removed', this.ticketRemoved);
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			// this.fetchTickets()
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			if (_main2.default) {
				_main2.default.service('gigs').removeListener('removed', this.gigRemoved);
				_main2.default.service('gigs').removeListener('created', this.gigCreated);
				_main2.default.service('gigs').removeListener('patched', this.gigPatched);
				_main2.default.service('tickets').removeListener('removed', this.ticketRemoved);
				_main2.default.service('tickets').removeListener('created', this.ticketCreated);
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var _this2 = this;

			var _state = this.state,
			    gig = _state.gig,
			    dialog = _state.dialog,
			    event = _state.event,
			    tickets = _state.tickets,
			    ticketsRaw = _state.ticketsRaw;
			// console.log("Volunteerizing: ", this.props)

			var title = _react2.default.createElement(
				'b',
				null,
				event.name
			);

			var subtitle = _react2.default.createElement(_gigTimespan2.default, { gig: event, showRelative: true });

			return _react2.default.createElement(
				_Card.Card,
				{ initiallyExpanded: true },
				_react2.default.createElement(_Card.CardTitle, {
					title: title,
					subtitle: subtitle
				}),
				_react2.default.createElement(_eventActions2.default, { event: event, tickets: ticketsRaw, route: this.props.route.path }),
				_react2.default.createElement(
					_Card.CardText,
					null,
					ticketsRaw.length ? _react2.default.createElement(
						'p',
						null,
						'You have volunteered for ',
						_react2.default.createElement(
							_reactRouter.Link,
							{ to: '/tasks' },
							ticketsRaw.length,
							' opportunities'
						),
						'. Feel free to select some more'
					) : _react2.default.createElement(
						'p',
						null,
						'\u041A\u043E\u0439\u0442\u043E \u043D\u0435 \u0440\u0430\u0431\u043E\u0442\u0438, \u043D\u0435 \u044F\u0434\u0435. \u0417\u0430 \u0434\u0430 \u043D\u0435 \u0438\u0437\u0445\u0432\u044A\u0440\u043B\u044F\u043C\u0435 \u0445\u0440\u0430\u043D\u0430, \u0437\u0430\u043F\u0438\u0448\u0435\u0442\u0435 \u0441\u0435 \u0434\u0430 \u0440\u0430\u0431\u043E\u0442\u0438\u0442\u0435.'
					),
					this.state.gigs.map(function (gig) {
						return _react2.default.createElement(_List.ListItem, {
							key: gig._id,
							primaryText: gig.name,
							onTouchTap: _this2.viewGigDetails.bind(_this2, gig),
							secondaryText: _react2.default.createElement(_gigTimespan2.default, { gig: gig }),
							rightIconButton: _this2.isVolunteering(gig) ? _react2.default.createElement(_FlatButton2.default, {
								icon: _icons.minusBox,
								title: 'Leave',
								onTouchTap: _utils.gigLeave.bind(_this2, gig, 'Volunteering')
							}) : _react2.default.createElement(_FlatButton2.default, {
								icon: _icons.plusOutline,
								title: 'Join',
								onTouchTap: _this2.handleGigJoin.bind(_this2, gig)
							})
						});
					})
				),
				_react2.default.createElement(
					_Dialog2.default,
					{ title: dialog.title, open: dialog.open, onRequestClose: this.dialogClose },
					_react2.default.createElement(_gigDetailsPage2.default, {
						gig: dialog.gig,
						onJoin: this.shiftJoin,
						onLeave: this.shiftLeave,
						tickets: tickets,
						status: tickets[dialog.gig._id]
					})
				),
				_react2.default.createElement(_Card.CardActions, null)
			);
		}
	}]);

	return EventPage;
}(_react2.default.Component);

exports.default = EventPage;

/***/ })

})