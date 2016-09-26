#!/usr/bin/env node

//
// Copyright (c) Microsoft and contributors.  All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//
// See the License for the specific language governing permissions and
// limitations under the License.
//

'use strict';

var bi = require('az-iot-bi');
var path = require('path');

var UsbUartTransport = require('./lib/usb-uart-transport');
var DeviceLookup = require('./lib/device-lookup');
var EthernetTransport = require('./lib/ethernet-transport');
var Timer = require('./lib/timer');
var WifiApTransport = require('./lib/wifi-ap-transport');
var VERSION = require('../package.json').version;

function main(argv) {
  bi.trackEvent('command_line_arguments', {
    argv: argv
  });

  if (argv.length === 1) {
    help();
    return 0;
  }

  switch (argv[1]) {
  case 'list':
    return cmd_list(argv.slice(2));
  case 'update':
  case 'upgrade':
  case 'version':
    console.log('Not implemented.'); // TODO
    return 1;
  default:
    help();
    return 1;
  }
}

function rpad(str, size) {
  if (str.length >= size) {
    return str;
  }
  return str + '                                                                                '.slice(0, size - str.length);
}

function help() {
  console.log([
    'Usage: devdisco <cmd>',
    '',
    'where <cmd> is one of:',
    '    list, update, upgrade, version',
    '',
    'Sample:',
    '',
    'devdisco list --eth      list the Ethernet devices',
    'devdisco list --usb      list the USB serial devices',
    'devdisco list --wifi     list the Wi-Fi devices',
    '',
  ].join('\r\n'));
  console.log('devdisco@' + VERSION, path.resolve(__dirname, 'devdisco'));
}

function cmd_list(argv) {
  if (!argv.length) {
    help();
    return 0;
  }
  var transport = null;
  var timeout = 5000; // 5 seconds
  for (var i = 0; i < argv.length; i++) {
    switch (argv[i]) {
    case '--eth':
    case '--usb':
    case '--wifi':
      if (transport) {
        console.log('Transport has already been specified as', transport + '.');
        return 1;
      }
      transport = argv[i];
      break;
    case '--timeout': // TODO: add documentation, we also need to check if multiple -timeout values have been specified
      timeout = parseInt(argv[++i]);
      if (isNaN(timeout)) {
        console.log('Timeout value must be specified as a positive number in milliseconds.');
        return 1;
      }
      break;
    default:
      console.log('Not implemented.'); // TODO: support wildcard filter by device type
      return 1;
    }
  }

  switch (transport) {
  case '--eth':
    cmd_list_ethernet(timeout);
    break;
  case '--usb':
    cmd_list_usb_uart();
    break;
  case '--wifi':
    cmd_list_wifi_ap();
    break;
  }
}

var deviceStatus = {};
var onDeviceDiscovered = function(record) {
  var deviceInfoStr = '?';
  if (record.device_type) {
    deviceInfoStr = record.device_type;
    var deviceInfo = DeviceLookup.resolveDeviceInfo(record.device_type);
    if (deviceInfo) {
      deviceInfoStr += ' (' + deviceInfo[0] + ')';
    }
  }
  switch(record.transport) {
  case 'ethernet':
    record = deviceStatus[record.ip_address] || record;
    deviceStatus[record.ip_address] = deviceStatus[record.ip_address] || record;
    if (record.is_processed) {
      break;
    }
    if (record.force_process || record.mac_address && record.host_name) {
      record.is_processed = true;
      console.log(
        rpad(record.ip_address, 16),
        rpad(record.mac_address || '??:??:??:??:??:??', 20),
        rpad(deviceInfoStr || '?', 32),
        record.host_name ? record.host_name.join(' ') : ''
      );
    }
    break;
  case 'wifi-ap':
    console.log(
      rpad(record.ssid, 16),
      rpad(record.mac_address || '??:??:??:??:??:??', 20),
      rpad(deviceInfoStr || '?', 32),
      rpad(record.channel, 8),
      rpad(record.signal_level, 14)
    );
    break;
  case 'usb-uart':
    console.log(
      rpad(record.com_name, 28),
      rpad(record.device_name_or_manufacturer, 40),
      rpad(deviceInfoStr || '?', 46)
    );
    break;
  default:
    console.log(JSON.stringify(record));
  }
};

function cmd_list_ethernet(timeout) {
  console.log('');
  console.log('Ethernet LAN Devices:');
  console.log('');
  console.log(rpad('IP Address', 16), rpad('MAC Address', 20), rpad('Device Type', 32), 'Host Name');
  console.log('');
  var browserWorkstation = EthernetTransport.beginDiscovery('workstation', onDeviceDiscovered);
  var browserTessel = EthernetTransport.beginDiscovery('tessel', onDeviceDiscovered);
  Timer.timeoutAsync(timeout).then(function () { // stop after timeout
    EthernetTransport.endDiscovery(browserWorkstation, onDeviceDiscovered);
    EthernetTransport.endDiscovery(browserTessel, onDeviceDiscovered);
    for (var key in deviceStatus) {
      deviceStatus[key].force_process = true;
      onDeviceDiscovered(deviceStatus[key]);
    }
  });
}

function cmd_list_wifi_ap() {
  console.log('');
  console.log('Wi-Fi Access Point:');
  console.log('');
  console.log(rpad('SSID', 16), rpad('MAC Address', 20), rpad('Device Type', 32), rpad('Channel', 8), rpad('Signal(dB)', 14));
  console.log('');
  WifiApTransport.beginDiscovery(onDeviceDiscovered);
}

function cmd_list_usb_uart() {
  console.log('');
  console.log('USB UART Devices:');
  console.log('');
  console.log(rpad('COM Port', 28), rpad('Device Name\\Manufacturer', 40), rpad('Device Type (Friendly Name)', 46));
  console.log('');
  UsbUartTransport.beginDiscovery(onDeviceDiscovered);
}

bi.start();
main(process.argv.slice(1));
bi.flush();
