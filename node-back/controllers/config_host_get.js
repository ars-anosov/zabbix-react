'use strict';

// https://www.zabbix.com/documentation/3.2/manual/api/reference/host/get

var apiTools = require('../sub_modules/api_tools')

exports.apiAction = function(req, res, next) {

  var args                = req.swagger.params
  
  var request             = req.myObj.request.module
  var reqOptions          = req.myObj.request.reqOptions
  
  var json_request = {
    "jsonrpc": "2.0",
    "method": "host.get",
    "params": {
      "output": [
        "host",
        "description"
      ],
      "selectInventory": [
        "notes"
      ],
      "selectInterfaces": [
        "type",
        "main",
        "useip",
        "ip",
        "dns",
        "port"
      ],
      "selectParentTemplates": [
        "templateid",
        "name"
      ],
      "selectGroups": [
        "groupid",
        "name"
      ],
      //"groupids": [],
      "filter": {
        "host": []
      }
    },
    "id": 2,
    "auth": req.myObj.request.auth
  }

  if (args.group.value) {
    json_request.params.groupids = [ args.group.value ]
  }

  if (args.name.value) {
    json_request.params.filter.host.push(args.name.value)
  }




  if (json_request.id) {
    reqOptions.body = JSON.stringify(json_request)
    console.log(reqOptions)

    request(reqOptions, function(requestErr, requestRes, requestBody) {
      var requestBodyJson = JSON.parse(requestBody)
      
      if (requestBodyJson.result) {

        // bug fixes
        requestBodyJson.result.map((row, i) => {

          // Inventory bug! Empty object responses as array : []
          if (typeof(row.inventory) === 'object') {
            requestBodyJson.result[i].inventory = {
              'notes': requestBodyJson.result[i].inventory.notes
            }
          }
          else {
            requestBodyJson.result[i].inventory = {
              'notes': ''
            }
          }

          // Old Zabbix has not description property
          if (!row.description) {
            requestBodyJson.result[i].description = ''
          }

        })

        apiTools.apiResJson(res, requestBodyJson.result, 200)
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