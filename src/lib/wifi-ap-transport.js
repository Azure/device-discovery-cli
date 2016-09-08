'use-strict';

var wifiscanner = require('node-wifiscanner');

var OuiLookup = require('./oui-lookup');

exports.beginDiscovery = function beginDiscovery(callback) {
  wifiscanner.scan(function(err, data) {
    if (err) {
      return;
    }
    for (var i = 0; i < data.length; i++) {
      (function(ssid, mac_address, channel, signal_level) {
        var device_type = OuiLookup.resolveMacToDeviceType(mac_address);
        var record = {
          channel: channel,
          device_type: device_type,
          mac_address: mac_address,
          signal_level: signal_level,
          ssid: ssid,
          transport: 'wifi-ap',
        };
        callback(record);
      })(data[i].ssid, data[i].mac, data[i].channel, data[i].signal_level);
    }
  });
};

exports.endDiscovery = function endDiscovery(/* callback */) {
};
