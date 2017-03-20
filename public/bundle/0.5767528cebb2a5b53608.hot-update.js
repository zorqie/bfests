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
				loading && _react2.default.createElement(CircularProgress, null),
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

/***/ 889:
false,

/***/ 890:
false,

/***/ 891:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = __webpack_require__(10);

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = __webpack_require__(11);

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _getPrototypeOf = __webpack_require__(5);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(2);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(3);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(7);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(6);

var _inherits3 = _interopRequireDefault(_inherits2);

var _simpleAssign = __webpack_require__(4);

var _simpleAssign2 = _interopRequireDefault(_simpleAssign);

var _react = __webpack_require__(1);

var _react2 = _interopRequireDefault(_react);

var _transitions = __webpack_require__(16);

var _transitions2 = _interopRequireDefault(_transitions);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function getRelativeValue(value, min, max) {
  var clampedValue = Math.min(Math.max(min, value), max);
  var rangeValue = max - min;
  var relValue = Math.round((clampedValue - min) / rangeValue * 10000) / 10000;
  return relValue * 100;
}

function getStyles(props, context) {
  var max = props.max,
      min = props.min,
      value = props.value;
  var _context$muiTheme = context.muiTheme,
      palette = _context$muiTheme.baseTheme.palette,
      borderRadius = _context$muiTheme.borderRadius;

  var styles = {
    root: {
      position: 'relative',
      height: 4,
      display: 'block',
      width: '100%',
      backgroundColor: palette.primary3Color,
      borderRadius: borderRadius,
      margin: 0,
      overflow: 'hidden'
    },
    bar: {
      height: '100%'
    },
    barFragment1: {},
    barFragment2: {}
  };

  if (props.mode === 'indeterminate') {
    styles.barFragment1 = {
      position: 'absolute',
      backgroundColor: props.color || palette.primary1Color,
      top: 0,
      left: 0,
      bottom: 0,
      transition: _transitions2.default.create('all', '840ms', null, 'cubic-bezier(0.650, 0.815, 0.735, 0.395)')
    };

    styles.barFragment2 = {
      position: 'absolute',
      backgroundColor: props.color || palette.primary1Color,
      top: 0,
      left: 0,
      bottom: 0,
      transition: _transitions2.default.create('all', '840ms', null, 'cubic-bezier(0.165, 0.840, 0.440, 1.000)')
    };
  } else {
    styles.bar.backgroundColor = props.color || palette.primary1Color;
    styles.bar.transition = _transitions2.default.create('width', '.3s', null, 'linear');
    styles.bar.width = getRelativeValue(value, min, max) + '%';
  }

  return styles;
}

var LinearProgress = function (_Component) {
  (0, _inherits3.default)(LinearProgress, _Component);

  function LinearProgress() {
    (0, _classCallCheck3.default)(this, LinearProgress);
    return (0, _possibleConstructorReturn3.default)(this, (LinearProgress.__proto__ || (0, _getPrototypeOf2.default)(LinearProgress)).apply(this, arguments));
  }

  (0, _createClass3.default)(LinearProgress, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this.timers = {};

      this.timers.bar1 = this.barUpdate('bar1', 0, this.refs.bar1, [[-35, 100], [100, -90]], 0);

      this.timers.bar2 = setTimeout(function () {
        _this2.barUpdate('bar2', 0, _this2.refs.bar2, [[-200, 100], [107, -8]], 0);
      }, 850);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.timers.bar1);
      clearTimeout(this.timers.bar2);
    }
  }, {
    key: 'barUpdate',
    value: function barUpdate(id, step, barElement, stepValues, timeToNextStep) {
      var _this3 = this;

      if (this.props.mode !== 'indeterminate') return;

      timeToNextStep = timeToNextStep || 420;
      step = step || 0;
      step %= 4;

      var right = this.context.muiTheme.isRtl ? 'left' : 'right';
      var left = this.context.muiTheme.isRtl ? 'right' : 'left';

      if (step === 0) {
        barElement.style[left] = stepValues[0][0] + '%';
        barElement.style[right] = stepValues[0][1] + '%';
      } else if (step === 1) {
        barElement.style.transitionDuration = '840ms';
      } else if (step === 2) {
        barElement.style[left] = stepValues[1][0] + '%';
        barElement.style[right] = stepValues[1][1] + '%';
      } else if (step === 3) {
        barElement.style.transitionDuration = '0ms';
      }
      this.timers[id] = setTimeout(function () {
        return _this3.barUpdate(id, step + 1, barElement, stepValues);
      }, timeToNextStep);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          style = _props.style,
          other = (0, _objectWithoutProperties3.default)(_props, ['style']);
      var prepareStyles = this.context.muiTheme.prepareStyles;

      var styles = getStyles(this.props, this.context);

      return _react2.default.createElement('div', (0, _extends3.default)({}, other, { style: prepareStyles((0, _simpleAssign2.default)(styles.root, style)) }), _react2.default.createElement('div', { style: prepareStyles(styles.bar) }, _react2.default.createElement('div', { ref: 'bar1', style: prepareStyles(styles.barFragment1) }), _react2.default.createElement('div', { ref: 'bar2', style: prepareStyles(styles.barFragment2) })));
    }
  }]);
  return LinearProgress;
}(_react.Component);

LinearProgress.defaultProps = {
  mode: 'indeterminate',
  value: 0,
  min: 0,
  max: 100
};
LinearProgress.contextTypes = {
  muiTheme: _react.PropTypes.object.isRequired
};
 true ? LinearProgress.propTypes = {
  /**
   * The color of the progress bar, defaults to
   * primary color of theme.
   */
  color: _react.PropTypes.string,
  /**
   * The max value of progress, only works in determinate mode.
   */
  max: _react.PropTypes.number,
  /**
   * The min value of progress, only works in determinate mode.
   */
  min: _react.PropTypes.number,
  /**
   * The mode of show your progress, indeterminate for when
   * there is no value for progress.
   */
  mode: _react.PropTypes.oneOf(['determinate', 'indeterminate']),
  /**
   * Override the inline-styles of the root element.
   */
  style: _react.PropTypes.object,
  /**
   * The value of progress, only works in determinate mode.
   */
  value: _react.PropTypes.number
} : void 0;
exports.default = LinearProgress;

/***/ }),

/***/ 892:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _LinearProgress = __webpack_require__(891);

var _LinearProgress2 = _interopRequireDefault(_LinearProgress);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = _LinearProgress2.default;

/***/ })

})