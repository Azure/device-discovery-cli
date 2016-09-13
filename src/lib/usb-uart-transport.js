'use-strict';

var serialPort = require('serialport');
var UsbLookup = require('./usb-lookup');

exports.beginDiscovery = function beginDiscovery(callback) {
  serialPort.list(function (err, ports) {
    if(err){
      return;
    }
    ports.forEach(function(port) {
      var pnpId = port.pnpId;
      if(!pnpId && port.vendorId && port.productId){
        pnpId = 'usb-VID_' + port.vendorId.split('0x')[1] + '&PID_' + port.productId.split('0x')[1];
      }
      var deviceName = UsbLookup.resolveUsbName(pnpId);
      var deviceType = UsbLookup.resolveDeviceType(pnpId);
      var deviceNameOrManufacturer = deviceName ? deviceName : port.manufacturer;
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
