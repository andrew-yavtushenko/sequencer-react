'use strict';

module.exports = function () {
  var isTouchDevice = 'ontouchstart' in document.documentElement;
  return {
    isTouchDevice: isTouchDevice
  };
};
