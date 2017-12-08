'use strict';

// https://www.zabbix.com/documentation/3.2/manual/api/reference/host/create

var apiTools = require('../sub_modules/api_tools')

exports.apiAction = function(req, res, next) {

  var args                = req.swagger.params
  
  var request             = req.myObj.request.module
  var reqOptions          = req.myObj.request.reqOptions

  var json_request                        = {
    "jsonrpc": "2.0",
    "method": 'host.create',
    "params": {
      "host": args.body.value.dns,
      "interfaces": [
        {
          "type": 2,
          "main": 1,
          "useip": 0,
          "ip": "",
          "dns": args.body.value.dns,
          "port": 161
        }
      ],
      "groups": [ {"groupid": args.body.value.groupid} ],
      "templates": [],
      "inventory_mode": 0,
      "inventory": {
        "notes": args.body.value.description
      }
    },
    "id": 4,
    "auth": req.myObj.request.auth
  }

  if (args.body.value.dns.match(/^\d+\.\d+\.\d+\.\d+$/i) !== null) {
    json_request.params.interfaces[0].useip = 1
    json_request.params.interfaces[0].ip = args.body.value.dns
    json_request.params.interfaces[0].dns = ''
  }

  // --------------------------------- //
  // Own logic for specific HostGroup. //
  // --------------------------------- //
  // Templates MUST BE in appropriate HostGroup at Zabbix Config. Otherwise error: "No permissions to referred object or it does not exist!"
  switch (true) {

    case (args.body.value.groupid === 9):
      //json_request.params.templates = [ {"templateid": 10106}, {"templateid": 10107} ]
      break

    case (args.body.value.groupid === 11):
      //json_request.params.templates = [ {"templateid": 10107}, {"templateid": 10108} ]
      break

    default:
      // No action for other HostGroups: uncomment below
      //json_request.id = null
      break
  }




  if (json_request.id) {
    reqOptions.body = JSON.stringify(json_request)
    console.log(reqOptions)

    request(reqOptions, function(requestErr, requestRes, requestBody) {
      var requestBodyJson = JSON.parse(requestBody)
      console.log(requestBodyJson)

      if (requestBodyJson.result) {
        apiTools.apiResJson(res, {code: 200, message: 'hostid: '+requestBodyJson.result.hostids[0]}, 200)
      }
      else {
        apiTools.apiResJson(res, {code: 202, message: 'Zabbix error: '+requestBodyJson.error.data}, 202)
      }
    });
  }
  else {
    apiTools.apiResJson(res, {code: 202, message: 'API - no actions'}, 202)
  }

}