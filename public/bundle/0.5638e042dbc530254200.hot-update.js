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

var _LinearProgress = __webpack_require__(892);

var _LinearProgress2 = _interopRequireDefault(_LinearProgress);

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
			_main2.default.service('tickets').find({ query: { status: 'Attending' } }).then(function (result) {

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
				_react2.default.createElement(_LinearProgress2.default, null),
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

/***/ })

})