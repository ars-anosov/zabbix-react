'use strict';

// https://www.zabbix.com/documentation/3.2/manual/api/reference/host/get
// https://bl.ocks.org/mbostock/4062045#miserables.json

var apiTools = require('../sub_modules/api_tools')

exports.apiAction = function(req, res, next) {

  var args                = req.swagger.params
  
  var request             = req.myObj.request.module
  var reqOptions          = req.myObj.request.reqOptions

  var d3Data = {
    "nodes": [],
    "links": []
  }
  var d3NodesTmp = {}




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

  if (args.layer.value) {
    console.log('layer:' + args.layer.value)
  }




  if (json_request.id) {
    reqOptions.body = JSON.stringify(json_request)
    console.log(reqOptions)

    request(reqOptions, function(requestErr, requestRes, requestBody) {
      var requestBodyJson = JSON.parse(requestBody)

      if (requestBodyJson.result) {

        // nodes" (all) -> d3NodesTmp
        requestBodyJson.result.map( (row, i) => {
          d3NodesTmp[row.host] = parseInt(row.groups[0].groupid)
        })

        requestBodyJson.result.map( (row, i) => {
          // "nodes" (all) --------------------------------
          //d3Data.nodes.push( {"id": row.host, "group": parseInt(row.groups[0].groupid)} )

          if (row.inventory) {
            if (row.inventory.notes) {

              var notesObj = {}
              try {
                notesObj = JSON.parse(row.inventory.notes)
              } catch (e) {
                console.log('JSON parse err')
              }

              if (notesObj[args.layer.value]) {
                notesObj[args.layer.value].map( (target, j) => {
                  // "links" from row.inventory.notes -----
                  d3Data.links.push( {"source": row.host, "target": target, "value": 1} )

                  // "nodes" (only with links) ------------
                  if (d3NodesTmp[row.host]) {
                    d3Data.nodes.push( {"id": row.host, "group": parseInt(row.groups[0].groupid)} )
                    d3NodesTmp[row.host] = false
                  }
                  if (d3NodesTmp[target]) {
                    d3Data.nodes.push( {"id": target, "group": parseInt(d3NodesTmp[target])} )
                    d3NodesTmp[target] = false
                  }

                })
              }

            }
          }

        })

        console.log(d3Data)
        apiTools.apiResJson(res, d3Data, 200)
      }
      else {
        apiTools.apiResJson(res, {code: 202, message: 'Zabbix error: '+requestBodyJson.error.data}, 202)
      }
      
    });
  }
  else {
    apiTools.apiResJson(res, {code: 200, message: 'API - no actions'}, 200)
  }

}