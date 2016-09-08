'use-strict';

var vow = require('vow');

exports.timeoutAsync = function timeoutAsync(milliseconds) {
  return new vow.Promise(function(resolve /*, reject, notify */) {
    setTimeout(function() {
      resolve();
    }, milliseconds);
  });
};
