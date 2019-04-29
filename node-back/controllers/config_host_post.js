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
  var hostGroupPassed = []
  //hostGroupPassed = apiTools.arrExistsByPropName([{'id': parseInt(args.body.value.groupid)}], 'id', req.zxSettings.hostGroups)
  req.zxSettings.hostGroups.map((row)=>{
    if (row.id === parseInt(args.body.value.groupid)) { hostGroupPassed = row }
  })
  console.log(hostGroupPassed)

  var finalMessage = 'API - no actions'
  // Templates MUST BE in appropriate HostGroup at Zabbix Config. Otherwise error: "No permissions to referred object or it does not exist!"
  switch (true) {

    case (!req.zxSettings.addHostAllowed):
      finalMessage = 'Запрещено добавлять любой Host'
      json_request.id = null
      break

    case (hostGroupPassed.length === 0):
      finalMessage = 'нельзя добавлять в Host Group id '+args.body.value.groupid
      json_request.id = null
      break

    // Навешиваю Template на определенную Host Group
    //case (args.body.value.groupid === 9):
    //  //json_request.params.templates = [ {"templateid": 10106}, {"templateid": 10107} ]
    //  break

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
    apiTools.apiResJson(res, {'code': 202, 'message': finalMessage}, 202)
  }

}