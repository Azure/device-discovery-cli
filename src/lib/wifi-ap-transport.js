'use-strict';

var bi = require('az-iot-bi');
var wifiscanner = require('node-wifiscanner');
var OuiLookup = require('./oui-lookup');

exports.beginDiscovery = function beginDiscovery(callback) {
  return new Promise(function(resolve, reject) {
    wifiscanner.scan(function(err, data) {
      if (err) {
        bi.trackEvent('wifi_error', {
          error: err.message
        });
        reject('\nProbably no Wi-Fi module on this computer.\n' + err.message);
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
      resolve(data);
    });
  })
};

exports.endDiscovery = function endDiscovery(/* callback */) {
};
