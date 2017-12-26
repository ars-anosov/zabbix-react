'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.OpenApiSwagger = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _swaggerClient = require('swagger-client');

var _swaggerClient2 = _interopRequireDefault(_swaggerClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var OpenApiSwagger = exports.OpenApiSwagger = function () {
  function OpenApiSwagger(specUrl) {
    _classCallCheck(this, OpenApiSwagger);

    this.specUrl = specUrl;
  }

  _createClass(OpenApiSwagger, [{
    key: 'connect',
    value: function connect(cb) {
      (0, _swaggerClient2.default)(this.specUrl).then(function (client) {
        cb(client, false);
      }).catch(function (err) {
        cb(null, err);
      });
    }
  }]);

  return OpenApiSwagger;
}();