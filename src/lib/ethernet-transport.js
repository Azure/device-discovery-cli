'use-strict';

var arp = require('node-arp');
var bi = require('az-iot-bi');
var dns = require('dns');
var mdns = require('mdns-js');
var vow = require('vow');

var OuiLookup = require('./oui-lookup');

function resolveIpAddressToHostNameAsync(address) {
  return new vow.Promise(function(resolve, reject /*, notify */) {
    dns.reverse(address, function(err, domains) {
      if(err) {
        bi.trackEvent('ethernet_error', {
          error: err.message
        });
        reject(err);
        return;
      }
      resolve(domains);
    });
  });
}

function resolveIpAddressToMacAddressAsync(address) {
  return new vow.Promise(function(resolve, reject /*, notify */) {
    arp.getMAC(address, function(err, mac) {
      if(err) {
        bi.trackEvent('ethernet_error', {
          error: err.message
        });
        reject(err);
        return;
      }
      resolve(mac);
    });
  });
}

exports.beginDiscovery = function beginDiscovery(serviceType, callback) {
  var browser = mdns.createBrowser(mdns.tcp(serviceType));

  browser.on('ready', function () {
    browser.discover();
  });

  browser.on('update', function (data) {
    var addresses = data.addresses;
    for (var i = 0; i < addresses.length; i++) {
      (function(ip_address, name, protocol) {
        var record = {
          category: 'DEVICE',
          ip_address: ip_address,
          mdns_name: name,
          mdns_protocol: protocol,
          transport: 'ethernet',
        };
        callback(record);
        resolveIpAddressToHostNameAsync(ip_address).then(function (res) {
          record.host_name = res;
          callback(record);
        });
        resolveIpAddressToMacAddressAsync(ip_address).then(function (res) {
          record.mac_address = res;
          record.device_type = OuiLookup.resolveMacToDeviceType(res);
          callback(record);
        });
      })(addresses[i], data.type[i].name, data.type[i].protocol);
    }
  });

  return browser;
};

exports.endDiscovery = function endDiscovery(browser /*, callback */) {
  if (browser) {
    browser.stop();
  }
};

mdns.excludeInterface('0.0.0.0'); // exclude local services

exports.resolveIpAddressToHostNameAsync = resolveIpAddressToHostNameAsync;
exports.resolveIpAddressToMacAddressAsync = resolveIpAddressToMacAddressAsync;
