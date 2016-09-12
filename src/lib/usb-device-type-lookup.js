'use-strict';

var fs = require('fs');
var path = require('path');

var mapping = (function() {
  var retval = [];
  var data = fs.readFileSync(path.resolve(__dirname, 'usb-device-type-mapping.csv'), 'UTF-8').split(/\r\n|\r|\n/g);
  for (var i = 0; i < data.length; i++) {
    var line = data[i];
    if (line && line[0] !== '#') {
      retval.push(line.split('\t'));
    }
  }
  return retval;
})();

function resolveUsbName(id) {
  if(id){
    for (var i = 0; i < mapping.length; i++) {
      if (id.indexOf(mapping[i][0]) === 0) {
        return mapping[i][1];
      }
    }
  }
}

exports.resolveUsbName = resolveUsbName;
