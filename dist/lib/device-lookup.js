'use strict';
'use-strict';

var fs = require('fs');
var path = require('path');

var mapping = function () {
  var retval = [];
  var data = fs.readFileSync(path.resolve(__dirname, 'device-mapping.csv'), 'UTF-8').split(/\r\n|\r|\n/g);
  for (var i = 0; i < data.length; i++) {
    var line = data[i];
    if (line && line[0] !== '#') {
      retval.push(line.split('\t'));
    }
  }
  return retval;
}();

function resolveDeviceInfo(id) {
  for (var i = 0; i < mapping.length; i++) {
    if (id === mapping[i][0]) {
      return mapping[i].slice(1);
    }
  }
}

exports.resolveDeviceInfo = resolveDeviceInfo;