'use strict';

var Promise = require('bluebird');
var connector = require('./Connector');

function checkAuth () {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'text';

    xhr.addEventListener('load', function (e) {
      if (e.target.status === 404) {
        reject(JSON.parse(e.target.response));
      } else {
        resolve(JSON.parse(e.target.response));
      }
    }, false);

    xhr.open('GET', '/users/current');
    xhr.send(null);
  });
}

function logout () {
  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'text';

    xhr.addEventListener('load', resolve, false);

    xhr.open('GET', '/logout');
    xhr.send(null);
  });
}

function login (serviceName, url) {
  return new Promise(function (resolve) {
    connector(url, serviceName.toLowerCase()).then(resolve);
  })
}

module.exports = {
  check: checkAuth,
  logout: logout,
  login: login
}