'use strict';

var Promise = require('bluebird');
var utils = require('./Utils');

module.exports = function (serviceUrl) {
  var promise;

  window.open(
    serviceUrl,
    'connector',
    'width=950,height=550');

  promise = new Promise(function (resolve) {
    window.connectService = function (data) {
      var provider, username;

      provider = utils.getParameterByName(data, 'provider');
      username = utils.getParameterByName(data, 'username');

      resolve({
        provider: provider,
        username: username
      });
    };
  });

  return promise;
};
