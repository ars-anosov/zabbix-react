'use strict';

// https://www.zabbix.com/documentation/3.2/manual/api/reference/host/update

var apiTools = require('../sub_modules/api_tools')

exports.apiAction = function(req, res, next) {

  var args                = req.swagger.params
  
  var request             = req.myObj.request.module
  var reqOptions          = req.myObj.request.reqOptions
  
  var json_request = {}
  var requestBodyJson = {}



  json_request = {
    "jsonrpc": "2.0",
    "method": "host.get",
    "params": {
      "hostids": args.hostid.value,
      "output": [
        "hostid"
      ],
      "selectGroups": [
        "groupid"
      ],
    },
    "id": 2,
    "auth": req.myObj.request.auth
  }

  reqOptions.body = JSON.stringify(json_request)
  console.log(reqOptions)

  // request No.1 (check HostGroup for req. HostId)
  request(reqOptions, function(requestErr, requestRes, requestBody) {
    
    requestBodyJson = JSON.parse(requestBody)
    var hostGroupId = requestBodyJson.result[0].groups[0].groupid
    console.log('check groupid: '+hostGroupId)

    json_request                        = {
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
    var hostGroupPassed = []
    //hostGroupPassed = apiTools.arrExistsByPropName([{'id': parseInt(hostGroupId)}], 'id', req.zxSettings.hostGroups)
    req.zxSettings.hostGroups.map((row)=>{
      if (row.id === parseInt(hostGroupId)) { hostGroupPassed = row }
    })
    console.log(hostGroupPassed)

    var finalMessage = 'API - no actions'
    switch (true) {

      case (!req.zxSettings.modHostAllowed):
        finalMessage = 'Запрещено изменять любой Host'
        json_request.id = null
        break

      case (hostGroupPassed.length === 0):
        finalMessage = 'нельзя изменять в Host Group id '+hostGroupId
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
          apiTools.apiResJson(res, {code: 200, message: 'updated hostid: '+requestBodyJson.result.hostids[0]}, 200)
        }
        else {
          apiTools.apiResJson(res, {code: 202, message: 'Zabbix error: '+requestBodyJson.error.data}, 202)
        }
      });
    }
    else {
      apiTools.apiResJson(res, {'code': 202, 'message': finalMessage}, 202)
    }

  })

}