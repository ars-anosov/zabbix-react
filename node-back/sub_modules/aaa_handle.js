'use strict';

var apiTools = require('./api_tools')

exports.checkAuth = function(req, res, next) {

  var mysqlOffice     = req.myObj.mysqlOffice
  var args = {};
  
  if (req.swagger) {
    // Объекта swagger присутствует.
    args              = req.swagger.params
    if (args.auth_name && args.auth_pass) {
      // Прилетел запрос с 2-мя полями args.auth_name и args.auth_pass
      if (args.layer.path[1] === 'token' && args.layer.path[2] === 'get') {
        // Клиент хочет обратиться в controller "token_get" для получения "token" на базе "args.auth_name" и "args.auth_pass". Пропускаю 
        next();
      }
      else {
        // Клиент хочет проскочить в controller отличный от "token_get"
        apiTools.apiResJson(res, {code: 401, message: 'token Unauthorized'}, 401);
      }
    }
    else {
      // У клиента есть token. Проверяю.
      
      var tokenCheckResult = ''
      // ----------------------------------------------------------------------------------
      // Здесь какая-нибудь процедура проверки достоверности "token" например в базе данных
      // ----------------------------------------------------------------------------------

      if (args.token.value === 'test') { tokenCheckResult = 'результат проверки - Ок' }
      apiResponse(tokenCheckResult)
    }
  }
  else {
    // Нет объекта swagger. Просто считывается spec. Пропускаю.
    next();    
  }
  






  function apiResponse(tokenCheckResult) {
    if (tokenCheckResult) {
      // Если есть результат - наполняю req.myObj.aaa для следующих middleware действий. Пропускаю.
      req.myObj.aaa = tokenCheckResult
      next()
    }
    else {
      apiTools.apiResJson(res, {code: 401, message: 'token Unauthorized'}, 401);
    }
  }

}
