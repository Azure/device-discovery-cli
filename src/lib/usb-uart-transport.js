'use-strict';

var serialPort = require('serialport');
var UsbNameLookup = require('./usb-name-lookup');

exports.beginDiscovery = function beginDiscovery(callback) {
  serialPort.list(function (err, ports) {
    if(err){
      return;
    }
    ports.forEach(function(port) {
      (function(com_name, pnp_id, vendor_id, product_id, manufacturer, specification) {
        if(com_name && manufacturer) {
          var deviceName = UsbNameLookup.resolveUsbName(pnp_id);
          var device_name_or_manufacturer = deviceName ? deviceName : manufacturer;
          var pnp_id_or_device_info;
          if(pnp_id) {
            pnp_id_or_device_info = pnp_id;
          } else if(vendor_id && product_id) {
            pnp_id_or_device_info = 'vendorId:' + vendor_id + '&productId:' + product_id;
          } else {
            pnp_id_or_device_info = '????????';
          }
          var record = {
            com_name: com_name,
            pnp_id_or_device_info: pnp_id_or_device_info,
            device_name_or_manufacturer: device_name_or_manufacturer,
            specification: specification,
            transport: 'usb-uart',
          };
          callback(record);
        }
      })(port.comName, port.pnpId, port.vendorId, port.productId, port.manufacturer, ''); 
    });
  });
};

exports.endDiscovery = function endDiscovery(/* callback */) {
};
