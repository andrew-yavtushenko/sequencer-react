'use strict';

var utils = require('./Utils');

window.connectService = function (data) {
  var token, status;

  token = utils.getParameterByName(data, getParameterName());
  status = utils.getParameterByName(data, 'status');

  if (token && (!status || status !== 'FAIL')) {
    resolve(token);
  } else {
    reject('Not Authorized');
  }
};

function connect (serviceName) {

  window.open(
    '/auth/' + serviceName,
    'connector',
    'width=950,height=550');

}