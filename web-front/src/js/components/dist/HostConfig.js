'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HostConfig = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _HostConfigRow = require('./HostConfigRow');

var _HostConfigRow2 = _interopRequireDefault(_HostConfigRow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HostConfig = exports.HostConfig = function (_React$Component) {
  _inherits(HostConfig, _React$Component);

  function HostConfig(args) {
    _classCallCheck(this, HostConfig);

    // наполняю this от Page

    var _this = _possibleConstructorReturn(this, (HostConfig.__proto__ || Object.getPrototypeOf(HostConfig)).call(this, args));

    _this.state = {
      groupList: [],
      inputHostName: _this.props.inputHostName || '',
      selectHostGroup: _this.props.selectHostGroup || '',
      showResult: true,
      searchResult: null
    };

    _this.handleChangeInput = _this.handleChangeInput.bind(_this);
    _this.handleChangeSelect = _this.handleChangeSelect.bind(_this);
    _this.handleClkShowResult = _this.handleClkShowResult.bind(_this);
    _this.handleClkAction = _this.handleClkAction.bind(_this);

    _this.apiCmd = {
      token: window.localStorage.getItem('token'),
      get: 'host_get',
      post: 'host_post',
      put: 'host_put',
      del: 'host_del',
      getGroups: 'hostgroup_get'

      // API actions ----------------------------------------
    };_this.hostAdd = function () {
      if (_this.state.inputHostName && parseInt(_this.state.selectHostGroup) > 0) {
        _this.props.swgClient.apis.Configuration[_this.apiCmd.post]({ token: _this.apiCmd.token, body: { dns: _this.state.inputHostName, groupid: parseInt(_this.state.selectHostGroup) } }).then(function (res) {

          if (res.status === 200) {
            _this.hostSearch();
          } else {
            console.log(res.body);
          }
        }).catch(function (err) {
          // err
        });
      }
    };

    _this.hostSearch = function () {
      var searchResultTemplate = [];

      _this.props.swgClient.apis.Configuration[_this.apiCmd.get]({ token: _this.apiCmd.token, name: _this.state.inputHostName, group: _this.state.selectHostGroup }).then(function (res) {

        if (res.status === 200) {
          res.body.map(function (row, i) {
            searchResultTemplate.push(_react2.default.createElement(_HostConfigRow2.default, _extends({ Win: _this }, { row: row, key: i })));
          });
        } else {
          console.log(res.body);
        }

        _this.setState({ searchResult: searchResultTemplate, showResult: true });
      }).catch(function (err) {
        // err
      });
    };

    // Select oprions -------------------------------------
    _this.props.swgClient.apis.Configuration[_this.apiCmd.getGroups]({ token: _this.apiCmd.token, name: '' }).then(function (res) {

      if (res.status === 200) {
        _this.setState({ groupList: res.body });
      } else {
        console.log(res.body);
      }
    }).catch(function (err) {
      //err
    });

    return _this;
  }

  _createClass(HostConfig, [{
    key: 'handleChangeInput',
    value: function handleChangeInput(event) {
      this.setState({ inputHostName: event.target.value });
    }
  }, {
    key: 'handleChangeSelect',
    value: function handleChangeSelect(event) {
      this.setState({ selectHostGroup: event.target.value });
    }
  }, {
    key: 'handleClkShowResult',
    value: function handleClkShowResult(event) {
      this.setState({ showResult: !this.state.showResult });
    }
  }, {
    key: 'handleClkAction',
    value: function handleClkAction(event) {
      switch (true) {

        case event.target.value === 'search':
          this.setState({ searchResult: null });
          this.hostSearch();
          break;

        case event.target.value === 'add':
          this.hostAdd();
          break;

        default:
          console.log('default');
          break;

      }
    }
  }, {
    key: 'render',
    value: function render() {
      console.log('HostConfig render');

      var finalTemplate = _react2.default.createElement(
        'div',
        { className: 'host-config-win' },
        _react2.default.createElement(
          'div',
          { className: 'std-item-header', onClick: this.handleClkShowResult },
          this.props.headerTxt
        ),
        _react2.default.createElement('input', { type: 'text', placeholder: 'DNS or IP', value: this.state.inputHostName, onChange: this.handleChangeInput }),
        _react2.default.createElement(
          'select',
          { size: '1', value: this.state.selectHostGroup, onChange: this.handleChangeSelect },
          _react2.default.createElement(
            'option',
            _defineProperty({ value: '' }, 'value', ''),
            '- select group -'
          ),
          this.state.groupList.map(function (row, i) {
            return _react2.default.createElement(
              'option',
              { key: i, value: row.groupid },
              row.name
            );
          })
        ),
        _react2.default.createElement('br', null),
        _react2.default.createElement(
          'button',
          { className: 'get-bttn', onClick: this.handleClkAction, value: 'search' },
          '\u041D\u0430\u0439\u0442\u0438'
        ),
        _react2.default.createElement(
          'button',
          { className: 'add-bttn', onClick: this.handleClkAction, value: 'add' },
          '\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C'
        ),
        _react2.default.createElement(
          'div',
          { className: this.state.showResult ? '' : 'display-none' },
          this.state.searchResult
        )
      );

      return finalTemplate;
    }
  }]);

  return HostConfig;
}(_react2.default.Component);