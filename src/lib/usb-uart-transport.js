'use-strict';

var serialPort = require('serialport');
var UsbNameLookup = require('./usb-name-lookup');

exports.beginDiscovery = function beginDiscovery(callback) {
  serialPort.list(function (err, ports) {
    if(err){
      return;
    }
    ports.forEach(function(port) {
      (function(com_name, pnp_id, manufacturer, specification) {
        if(pnp_id){
          var deviceName = UsbNameLookup.resolveUsbName(pnp_id);
          var device_name_or_manufacturer = deviceName ? deviceName : manufacturer;
          var record = {
            com_name: com_name,
            pnp_id: pnp_id,
            device_name_or_manufacturer: device_name_or_manufacturer,
            specification: specification,
            transport: 'usb-uart',
          };
          callback(record);
        }
      })(port.comName, port.pnpId, port.manufacturer, ''); 
    });
  });
};

exports.endDiscovery = function endDiscovery(/* callback */) {
};
