webpackHotUpdate(0,{

/***/ 213:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.EventActions = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _reactRouter = __webpack_require__(21);

var _RaisedButton = __webpack_require__(58);

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _Card = __webpack_require__(48);

var _main = __webpack_require__(26);

var _main2 = _interopRequireDefault(_main);

var _utils = __webpack_require__(87);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var updatePass = function updatePass(event, status, update) {
	_main2.default.authenticate().then(function () {
		if (update) {
			_main2.default.service('tickets').patch(null, { status: status }, { query: { gig_id: event._id } }); //we never use this...
		} else {
			// insert
			(0, _utils.gigJoin)(event, status);
		}
	}).catch(function (err) {
		return _reactRouter.browserHistory.push('/eventinfo/' + event._id);
	});
};

var EventActions = exports.EventActions = function EventActions(_ref) {
	var event = _ref.event,
	    tickets = _ref.tickets,
	    route = _ref.route;

	var result = [];
	if (event.tickets && event.tickets.length) {
		//at least one ticket
		event.tickets.forEach(function (pass) {
			var rules = event.ticket_rules.filter(function (r) {
				return r.status === pass.status;
			});
			rules.forEach(function (_ref2) {
				var requires = _ref2.requires,
				    actions = _ref2.actions;

				if (Array.isArray(requires)) {
					// 
					console.log("HURRAY, ARRAY (so we ignore it for now...)", requires);
				} else if ((typeof requires === 'undefined' ? 'undefined' : _typeof(requires)) === 'object') {
					//object
					// console.log("Required", requires)
					var status = requires.status,
					    minCount = requires.minCount,
					    maxCount = requires.maxCount;

					var matched = tickets.filter(function (t) {
						return t.status === status;
					});
					if (matched.length >= minCount) {
						result = result.concat(actions);
					}
				} else {
					// no requires or something weird
					result = result.concat(actions);
				}
			});
			// console.log("RULEZ!", rules)
		});
	} else if (event.tickets && event.ticket_rules) {
		var rule = event.ticket_rules.find(function (r) {
			return r.status === null;
		});
		result = result.concat(rule.actions);
		// console.log("rule", rule)
	}

	var actions = result.filter(function (a) {
		return a.name && (a.newStatus || route !== a.path);
	});
	// console.log("ACTING", actions)

	return _react2.default.createElement(
		_Card.CardActions,
		null,
		actions.map(function (_ref3) {
			var name = _ref3.name,
			    path = _ref3.path,
			    newStatus = _ref3.newStatus;
			return path ? _react2.default.createElement(
				_reactRouter.Link,
				{ key: event._id + name, to: path.replace(':eventId', event._id) },
				_react2.default.createElement(_RaisedButton2.default, { label: name })
			) : _react2.default.createElement(_RaisedButton2.default, {
				key: event._id + name,
				primary: true,
				label: name,
				onTouchTap: updatePass.bind(null, event, newStatus, false)
			});
		})
	);
};

exports.default = EventActions;

/***/ })

})