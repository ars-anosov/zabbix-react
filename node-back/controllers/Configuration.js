'use strict';

var m_host_get    = require('./config_host_get')
var m_host_post   = require('./config_host_post')
var m_host_put    = require('./config_host_put')
var m_host_del    = require('./config_host_del')

var m_hostgroup_get    = require('./config_hostgroup_get')




module.exports.host_get = function host_get(req, res, next) {
  m_host_get.apiAction(req, res, next)
}
module.exports.host_post = function host_post(req, res, next) {
  m_host_post.apiAction(req, res, next)
}
module.exports.host_put = function host_put(req, res, next) {
  m_host_put.apiAction(req, res, next)
}
module.exports.host_del = function host_del(req, res, next) {
  m_host_del.apiAction(req, res, next);
}

module.exports.hostgroup_get = function hostgroup_get(req, res, next) {
  m_hostgroup_get.apiAction(req, res, next)
}