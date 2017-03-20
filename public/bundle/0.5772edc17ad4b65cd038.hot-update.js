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

/***/ 889:
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

var _autoPrefix = __webpack_require__(126);

var _autoPrefix2 = _interopRequireDefault(_autoPrefix);

var _transitions = __webpack_require__(16);

var _transitions2 = _interopRequireDefault(_transitions);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function getRelativeValue(value, min, max) {
  var clampedValue = Math.min(Math.max(min, value), max);
  return clampedValue / (max - min);
}

function getArcLength(fraction, props) {
  return fraction * Math.PI * (props.size - props.thickness);
}

function getStyles(props, context) {
  var max = props.max,
      min = props.min,
      size = props.size,
      value = props.value;
  var palette = context.muiTheme.baseTheme.palette;

  var styles = {
    root: {
      position: 'relative',
      display: 'inline-block',
      width: size,
      height: size
    },
    wrapper: {
      width: size,
      height: size,
      display: 'inline-block',
      transition: _transitions2.default.create('transform', '20s', null, 'linear'),
      transitionTimingFunction: 'linear'
    },
    svg: {
      width: size,
      height: size,
      position: 'relative'
    },
    path: {
      stroke: props.color || palette.primary1Color,
      strokeLinecap: 'round',
      transition: _transitions2.default.create('all', '1.5s', null, 'ease-in-out')
    }
  };

  if (props.mode === 'determinate') {
    var relVal = getRelativeValue(value, min, max);
    styles.path.transition = _transitions2.default.create('all', '0.3s', null, 'linear');
    styles.path.strokeDasharray = getArcLength(relVal, props) + ', ' + getArcLength(1, props);
  }

  return styles;
}

var CircularProgress = function (_Component) {
  (0, _inherits3.default)(CircularProgress, _Component);

  function CircularProgress() {
    (0, _classCallCheck3.default)(this, CircularProgress);
    return (0, _possibleConstructorReturn3.default)(this, (CircularProgress.__proto__ || (0, _getPrototypeOf2.default)(CircularProgress)).apply(this, arguments));
  }

  (0, _createClass3.default)(CircularProgress, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.scalePath(this.refs.path);
      this.rotateWrapper(this.refs.wrapper);
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      clearTimeout(this.scalePathTimer);
      clearTimeout(this.rotateWrapperTimer);
    }
  }, {
    key: 'scalePath',
    value: function scalePath(path) {
      var _this2 = this;

      var step = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

      if (this.props.mode !== 'indeterminate') return;

      step %= 3;

      if (step === 0) {
        path.style.strokeDasharray = getArcLength(0, this.props) + ', ' + getArcLength(1, this.props);
        path.style.strokeDashoffset = 0;
        path.style.transitionDuration = '0ms';
      } else if (step === 1) {
        path.style.strokeDasharray = getArcLength(0.7, this.props) + ', ' + getArcLength(1, this.props);
        path.style.strokeDashoffset = getArcLength(-0.3, this.props);
        path.style.transitionDuration = '750ms';
      } else {
        path.style.strokeDasharray = getArcLength(0.7, this.props) + ', ' + getArcLength(1, this.props);
        path.style.strokeDashoffset = getArcLength(-1, this.props);
        path.style.transitionDuration = '850ms';
      }

      this.scalePathTimer = setTimeout(function () {
        return _this2.scalePath(path, step + 1);
      }, step ? 750 : 250);
    }
  }, {
    key: 'rotateWrapper',
    value: function rotateWrapper(wrapper) {
      var _this3 = this;

      if (this.props.mode !== 'indeterminate') return;

      _autoPrefix2.default.set(wrapper.style, 'transform', 'rotate(0deg)');
      _autoPrefix2.default.set(wrapper.style, 'transitionDuration', '0ms');

      setTimeout(function () {
        _autoPrefix2.default.set(wrapper.style, 'transform', 'rotate(1800deg)');
        _autoPrefix2.default.set(wrapper.style, 'transitionDuration', '10s');
        _autoPrefix2.default.set(wrapper.style, 'transitionTimingFunction', 'linear');
      }, 50);

      this.rotateWrapperTimer = setTimeout(function () {
        return _this3.rotateWrapper(wrapper);
      }, 10050);
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          style = _props.style,
          innerStyle = _props.innerStyle,
          size = _props.size,
          thickness = _props.thickness,
          other = (0, _objectWithoutProperties3.default)(_props, ['style', 'innerStyle', 'size', 'thickness']);
      var prepareStyles = this.context.muiTheme.prepareStyles;

      var styles = getStyles(this.props, this.context);

      return _react2.default.createElement('div', (0, _extends3.default)({}, other, { style: prepareStyles((0, _simpleAssign2.default)(styles.root, style)) }), _react2.default.createElement('div', { ref: 'wrapper', style: prepareStyles((0, _simpleAssign2.default)(styles.wrapper, innerStyle)) }, _react2.default.createElement('svg', {
        viewBox: '0 0 ' + size + ' ' + size,
        style: prepareStyles(styles.svg)
      }, _react2.default.createElement('circle', {
        ref: 'path',
        style: prepareStyles(styles.path),
        cx: size / 2,
        cy: size / 2,
        r: (size - thickness) / 2,
        fill: 'none',
        strokeWidth: thickness,
        strokeMiterlimit: '20'
      }))));
    }
  }]);
  return CircularProgress;
}(_react.Component);

CircularProgress.defaultProps = {
  mode: 'indeterminate',
  value: 0,
  min: 0,
  max: 100,
  size: 40,
  thickness: 3.5
};
CircularProgress.contextTypes = {
  muiTheme: _react.PropTypes.object.isRequired
};
 true ? CircularProgress.propTypes = {
  /**
   * Override the progress's color.
   */
  color: _react.PropTypes.string,
  /**
   * Style for inner wrapper div.
   */
  innerStyle: _react.PropTypes.object,
  /**
   * The max value of progress, only works in determinate mode.
   */
  max: _react.PropTypes.number,
  /**
   * The min value of progress, only works in determinate mode.
   */
  min: _react.PropTypes.number,
  /**
   * The mode of show your progress, indeterminate
   * for when there is no value for progress.
   */
  mode: _react.PropTypes.oneOf(['determinate', 'indeterminate']),
  /**
   * The diameter of the progress in pixels.
   */
  size: _react.PropTypes.number,
  /**
   * Override the inline-styles of the root element.
   */
  style: _react.PropTypes.object,
  /**
   * Stroke width in pixels.
   */
  thickness: _react.PropTypes.number,
  /**
   * The value of progress, only works in determinate mode.
   */
  value: _react.PropTypes.number
} : void 0;
exports.default = CircularProgress;

/***/ }),

/***/ 890:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = undefined;

var _CircularProgress = __webpack_require__(889);

var _CircularProgress2 = _interopRequireDefault(_CircularProgress);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = _CircularProgress2.default;

/***/ }),

/***/ 891:
false,

/***/ 892:
false

})