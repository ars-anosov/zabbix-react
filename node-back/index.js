'use strict';

// Arguments ---------------------------------------------
var nodePath  = process.argv[0]
var appPath   = process.argv[1]
var zxUrl     = process.argv[2]
var zxUser    = process.argv[3]
var zxPass    = typeof process.argv[4] === 'undefined' ? '' : process.argv[4]

console.log('Zabbix URL:      '+zxUrl)
console.log('Zabbix User:     '+zxUser)
console.log('Zabbix Password: '+zxPass)
console.log()
var aaa_handle = require('./sub_modules/aaa_handle')


var fs = require('fs'),
    path = require('path')

var app = require('connect')()
var swaggerTools = require('swagger-tools')
var jsyaml = require('js-yaml')

var http = require('http')
var serverPort = 8002

//var https = require('https');
//var httpsServerPort = 8002;
//var httpsOptions = {
//  //ca:   fs.readFileSync('ssl/ca.crt'),
//  key:  fs.readFileSync('ssl/server.key'),
//  cert: fs.readFileSync('ssl/server.crt')  
//};

// https://github.com/apigee-127/swagger-tools/blob/master/docs/Middleware.md

// swaggerRouter configuration
var options = {
  swaggerUi: path.join(__dirname, '/swagger.json'),
  controllers: path.join(__dirname, './controllers'),
  useStubs: process.env.NODE_ENV === 'development' // Conditionally turn on stubs (mock mode)
};

// The Swagger document (require it, build it programmatically, fetch it from a URL, ...)
var spec = fs.readFileSync(path.join(__dirname,'api/zabbix-api.yaml'), 'utf8');
var swaggerDoc = jsyaml.safeLoad(spec);




// reqclient --------------------------------------------------------
const request = require('request');
var zxAuth = '';
var reqOptions = {  
  url: zxUrl,
  method: 'POST',
  headers: {
      'Content-Type': 'application/json'
  },
  body: ''
};

var userLoginJsonReq = {
  "jsonrpc": "2.0",
  "method": "user.login",
  "params": {
      "user": zxUser,
      "password": zxPass
  },
  "id": 1,
  "auth": null
}

function getZbxAuthToken(jsonReq) {
	reqOptions.body = JSON.stringify(jsonReq)
	request(reqOptions, function(err, res, body) {  
    let json = JSON.parse(body)
    console.log('Zabbix Auth: '+json.result)
    zxAuth = json.result
  })
}

// Auth every minute ---------------------------
getZbxAuthToken(userLoginJsonReq)
setInterval(() => {
  getZbxAuthToken(userLoginJsonReq)
}, 60000)




// Initialize the Swagger middleware
swaggerTools.initializeMiddleware(swaggerDoc, function (middleware) {


  // Работаю с модулем connect ======================================

  // Дополняю connect req дополнительными объектами
  app.use(function(req, res, next) {
    req.myObj = {
      'request': {
        'module': request,
        'reqOptions': reqOptions,
        'auth': zxAuth
      },
      'aaa': null
    };
    next();
  });

  // CORS - добавляю заголовки
  app.use(function (req, res, next) {
    //console.log(req);
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // После OAuth2 клиент пробъет запросом OPTION с Access-Control-Request-Headers: authorization  +  Access-Control-Request-Method:GET
    // Надо сообщить браузеру клиента что мы эту умеем такое
    res.setHeader('Access-Control-Allow-Headers', 'authorization, token, content-type')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
    
    next();
  });
  
  // Не включаю умную обработку OPTIONS
  app.use(function(req, res, next) {
    if (req.method == 'OPTIONS') {
      res.end();
    }
    else {
      next();
    }
  });

  // Если у запроса есть в Header поле Authorization:Bearer значит была пройдена OAuth2
  app.use(function(req, res, next) {
    if (req.headers.authorization) {
      console.log(req.headers.authorization);
    }
    next();
  });

  // Заготовка на отдачу static файла
  app.use(function (req, res, next) {

    switch (true) {

      case (req.url === '/favion.ico'):
        res.end()
        break

      case (req.url === '/miserables.json'):
        console.log('miserables.json')
        res.end()
        break

      default:
        next();
        break

    }

  });








  // Работаю с модулем swaggerTools (объект middleware) =============
  // https://github.com/apigee-127/swagger-tools/blob/master/docs/Middleware.md

  // Interpret Swagger resources and attach metadata to request - must be first in swagger-tools middleware chain
  app.use(middleware.swaggerMetadata());

  // Provide the security handlers
  //app.use(middleware.swaggerSecurity({
  //  oauth2: function (req, def, scopes, callback) {
  //    // Do real stuff here
  //  }
  //}));

  // AAA на базе Header поля "token"
  app.use(function (req, res, next) {
    aaa_handle.checkAuth(req, res, next);
  });

  // Validate Swagger requests
  app.use(middleware.swaggerValidator({
    validateResponse: true
  }));

  // Route validated requests to appropriate controller
  app.use(middleware.swaggerRouter(options));

  // Serve the Swagger documents and Swagger UI
  // https://github.com/apigee-127/swagger-tools/blob/master/middleware/swagger-ui.js
  app.use(middleware.swaggerUi({
    apiDocs: '/spec/swagger.json',
    swaggerUi: '/spec-ui'
  }));





  // Работаю с модулем http, https ==================================
  // Start the server
  http.createServer(app).listen(serverPort, function () {
    console.log('Swagger http started on port '+serverPort);
  });

  //https.createServer(httpsOptions, app).listen(httpsServerPort, function () {
  //  console.log('Swagger https started on port '+httpsServerPort);
  //});

});
