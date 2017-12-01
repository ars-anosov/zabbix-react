'use strict';

var m_hostlink_get    = require('./data_hostlink_get')




module.exports.hostlink_get = function hostlink_get(req, res, next) {
  m_hostlink_get.apiAction(req, res, next)
}