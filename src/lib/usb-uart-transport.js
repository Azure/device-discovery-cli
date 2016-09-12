'use-strict';

var serialPort = require('serialport');
var UsbNameAndDeviceTypeLookup = require('./usb-name-and-device-type-lookup');

exports.beginDiscovery = function beginDiscovery(callback) {
  serialPort.list(function (err, ports) {
    if(err){
      return;
    }
    ports.forEach(function(port) {
      var deviceName = UsbNameAndDeviceTypeLookup.resolveUsbName(port.pnpId);
      var deviceNameOrManufacturer = deviceName ? deviceName : port.manufacturer;
      var deviceType = UsbNameAndDeviceTypeLookup.resolveDeviceType(port.pnpId);
      (function(com_name, device_name_or_manufacturer, device_type) {
        if(com_name && device_name_or_manufacturer) {
          var record = {
            com_name: com_name,
            device_name_or_manufacturer: device_name_or_manufacturer,
            device_type: device_type,
            transport: 'usb-uart',
          };
          callback(record);
        }
      })(port.comName, deviceNameOrManufacturer, deviceType); 
    });
  });
};

exports.endDiscovery = function endDiscovery(/* callback */) {
};
