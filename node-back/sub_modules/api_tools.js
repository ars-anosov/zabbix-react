'use strict';

/** Генератор случайной строки
 * @param {int} n длинна строки
 */
const randWDclassic = function (n) {
  var s ='', abd ='abcdefghijklmnopqrstuvwxyz0123456789', aL = abd.length;
  while(s.length < n)
    s += abd[Math.random() * aL|0];
  return s;
}









/** Генератор sha1-base64 hash
 * @param {string} pass пароль
 * @param {string} salt соль
 * @param {int} length длинна hash. Нужна чтобы отрезать "=" в конце
 */
const passHashGet = function (pass, salt, length) {
  var crypto = require('crypto');

  var sha = crypto.createHash('sha1');
  sha.update(pass+':)'+salt);           // собственные рецепт
  var token = sha.digest('base64');
  return token.substring(0, length);    // отрезаю символы = которые генерит алгоритм base64 node в отличие от perl
}









/** Генератор случайной строки
 * @param {obj} res middleware res obj
 * @param {obj} resObj данные, которые нужно впихнуть в res
 * @param {int} statusCode HTTP status code
 */
const apiResJson = function (res, resObj, statusCode) {
  var response = {};
  response['application/json'] = resObj;

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');

  res.end(JSON.stringify(response[Object.keys(response)[0]] || {}, null, 2));
}









/** выдает часть массива a1 у которого a1[propName] присутствует в a2
 * @param {array} a1 массив объектов у которых есть свойство с именем propName
 * @param {string} propName имя свойства
 * @param {array} a2 массив разрешенных вариантов содержимого в propName у a1
 */
const arrExistsByPropName = function (a1, propName, a2) {
  if (a1 && a2) {
    if (a2[0] === '*') {
      return a1
    }
    else {
      return a1.filter( (i) => {
        let flag = false
        flag = a2.includes(i[propName])
        return flag
      })
    }
  }
  else {
    return []
  }
}









module.exports.randWDclassic  = randWDclassic
module.exports.passHashGet  = passHashGet
module.exports.apiResJson  = apiResJson
module.exports.arrExistsByPropName  = arrExistsByPropName