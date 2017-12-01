'use strict';

// https://www.zabbix.com/documentation/3.2/manual/api/reference/host/update

var apiTools = require('../sub_modules/api_tools')

exports.apiAction = function(req, res, next) {

  var args                = req.swagger.params
  
  var request             = req.myObj.request.module
  var reqOptions          = req.myObj.request.reqOptions
  
  var json_request                        = {
    "jsonrpc": "2.0",
    "method": 'host.update',
    "params": {
      "hostid": args.hostid.value,
      "description": args.body.value.description,
      "inventory_mode": 0,
      "inventory": {
        "notes": args.body.value.inventory.notes
      }
    },
    "id": 4,
    "auth": req.myObj.request.auth
  }

  // --------------------------------- //
  // Own logic for specific HostGroup. //
  // --------------------------------- //
  switch (true) {

    case (args.body.value.groupid === 8):
      json_request.id = null
      break

    // Pass all HostGroups
    default:
      // pass
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