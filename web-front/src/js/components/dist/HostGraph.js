'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.HostGraph = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var d3 = require("d3");

var HostGraph = exports.HostGraph = function (_React$Component) {
  _inherits(HostGraph, _React$Component);

  function HostGraph(args) {
    _classCallCheck(this, HostGraph);

    var _this = _possibleConstructorReturn(this, (HostGraph.__proto__ || Object.getPrototypeOf(HostGraph)).call(this, args));

    _this.state = {
      clkHostId: ''
    };

    _this.handleClkAction = _this.handleClkAction.bind(_this);

    _this.apiCmd = {
      token: window.localStorage.getItem('token'),
      getLinks: 'hostlink_get',
      getGroups: 'hostgroup_get'

      // Grapf ----------------------------------------------
    };_this.forceDirectedGraph = function (layer) {
      // https://bl.ocks.org/mbostock/4062045
      var self = _this;

      var svg = d3.select(_this.node),
          width = +svg.attr("width"),
          height = +svg.attr("height");

      svg.selectAll("*").remove();

      var color = d3.scaleOrdinal(d3.schemeCategory20);

      var simulation = d3.forceSimulation().force("link", d3.forceLink().distance(60).id(function (d) {
        return d.id;
      })).force("charge", d3.forceManyBody()).force("center", d3.forceCenter(width / 2, height / 2));

      function dragstarted(d) {
        //self.setState({clkHostId: d.id})
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }

      // get Groups
      var drawSvgContent = function drawSvgContent() {
        var groupsObj = {};
        _this.props.swgClient.apis.Configuration[_this.apiCmd.getGroups]({ token: _this.apiCmd.token }).then(function (res) {
          if (res.status === 200) {
            res.body.map(function (row, i) {
              groupsObj[row.groupid] = { 'name': row.name, 'color': color(i) };
            });
            drawLinks(groupsObj);
          } else {
            console.log(res.body);
          }
        });
      };

      // Get Nodes and Links
      var drawLinks = function drawLinks(groupsObj) {
        _this.props.swgClient.apis.Data[_this.apiCmd.getLinks]({ token: _this.apiCmd.token, layer: layer }).then(function (res) {
          if (res.status === 200) {
            var ticked = function ticked() {
              link.attr("x1", function (d) {
                return d.source.x;
              }).attr("y1", function (d) {
                return d.source.y;
              }).attr("x2", function (d) {
                return d.target.x;
              }).attr("y2", function (d) {
                return d.target.y;
              });

              node.attr("cx", function (d) {
                return d.x;
              }).attr("cy", function (d) {
                return d.y;
              });

              ttt.attr("x", function (d) {
                return d.x - 5;
              }).attr("y", function (d) {
                return d.y - 10;
              });
            };

            var graph = res.body;

            var link = svg.append("g").attr("class", "links").selectAll("line").data(graph.links).enter().append("line").attr("stroke-width", function (d) {
              return Math.sqrt(d.value);
            });

            var node = svg.append("g").attr("class", "nodes").selectAll("circle").data(graph.nodes).enter().append("circle").attr("r", 8).attr("fill", function (d) {
              return groupsObj[d.group].color;
            }).call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));

            node.append("title").text(function (d) {
              return d.id + ', group: ' + groupsObj[d.group].name;
            });

            var ttt = svg.append("g").attr("class", "texts").selectAll("text").data(graph.nodes).enter().append("text").attr("fill", function (d) {
              return groupsObj[d.group].color;
            }).text(function (d) {
              // dns.name
              var sss = d.id.split('.');
              // IP v4
              if (d.id.match(/^\d+\.\d+\.\d+\.\d+$/i) !== null) {
                sss[0] = d.id;
              }
              return sss[0];
            });

            // Legend
            var groupsPresent = {};
            res.body.nodes.map(function (row, i) {
              groupsPresent[row.group] = 1;
            });
            var topPx = 20;

            var _loop = function _loop(key) {
              svg.append("text").attr("class", "texts").attr("fill", function (d) {
                return groupsObj[key].color;
              }).attr("x", "5px").attr("y", topPx + "px").text(groupsObj[key].name);
              topPx = topPx + 12;
            };

            for (var key in groupsPresent) {
              _loop(key);
            }

            // go go go
            simulation.nodes(graph.nodes).on("tick", ticked);

            simulation.force("link").links(graph.links);
          } else {
            console.log(res.body);
          }
        });
      };

      drawSvgContent();
    };

    return _this;
  }

  _createClass(HostGraph, [{
    key: 'handleClkAction',
    value: function handleClkAction(event) {
      this.forceDirectedGraph(event.target.value);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      console.log('HostGraph render');

      var finalTemplate = _react2.default.createElement(
        'div',
        { className: 'host-graph-win' },
        _react2.default.createElement(
          'pre',
          { className: 'std-item-header' },
          this.props.headerTxt
        ),
        _react2.default.createElement(
          'pre',
          null,
          _react2.default.createElement(
            'button',
            { className: 'get-bttn', onClick: this.handleClkAction, value: 'L1' },
            'L1'
          ),
          _react2.default.createElement(
            'button',
            { className: 'get-bttn', onClick: this.handleClkAction, value: 'L2' },
            'L2'
          ),
          _react2.default.createElement(
            'button',
            { className: 'get-bttn', onClick: this.handleClkAction, value: 'L3' },
            'L3'
          )
        ),
        _react2.default.createElement('svg', { ref: function ref(node) {
            return _this2.node = node;
          }, width: 640, height: 480 })
      );

      return finalTemplate;
    }
  }]);

  return HostGraph;
}(_react2.default.Component);