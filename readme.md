# device-discovery-cli

> A cross platform command line utility which can discover devices connected via Ethernet, Wi-Fi and USB.

*Issues with the output should be reported on the <https://github.com/Azure/device-discovery-cli/issues>.*


## Install

```
$ npm install --global device-discovery-cli
```


## Usage

	$ devdisco

	Usage: devdisco <cmd>

	where <cmd> is one of:
		list, update, upgrade, version

	Sample:

	devdisco list --eth      list the Ethernet devices
	devdisco list --usb      list the USB serial devices
	devdisco list --wifi     list the Wi-Fi devices

	devdisco@0.5.0 /usr/bin/devdisco

## Sample Output

##### Ethernet Devices

	IP Address    MAC Address       Type                                    Host Name

	10.172.14.69  08:00:27:d7:27:ef raspberrypi (Raspberry Pi)              raspberrypi
	10.172.15.84  00:15:5d:0f:9d:01 tessel (Tessel 2)                       tessel2
	10.172.14.219 00:0c:29:35:fa:9f huzzah (Adafruit HUZZAH ESP8266)
	10.172.15.98  78:2b:cb:b5:1c:9c ?
	10.172.14.81  00:0c:29:77:f7:68 ?
	10.172.14.61  00:1b:21:c6:92:ca ?
	10.172.15.69  24:be:05:1f:88:42 ?
	10.172.15.143 00:15:5d:0f:08:00 ?
	10.172.15.29  34:17:eb:ce:8d:8d ?
	10.172.15.92  b8:27:eb:41:22:8d ?
	10.172.14.47  64:00:6a:95:ca:5b ?
	10.172.14.167 64:00:6a:76:fd:49 ?
	10.172.14.184 50:65:f3:56:11:1f ?
	10.172.14.42  68:05:ca:0c:2e:77 ?
	10.172.15.148 94:57:a5:cc:99:86 ?


##### USB UART Devices

	COM Port      Device Id                              Device Type

	COM1          PCI\VEN_8086&DEV_1D26&SUBSYS_158A103C
	COM2          PCI\VEN_8086&DEV_1D26&SUBSYS_158A103D  tessel (Tessel 2)

##### Wi-Fi Access Points:

	SSID          MAC Address       Device Type          Channel          Signal (dB)

	MSFTLAB       94:57:a5:cc:99:86 ?                    1                -50.5
	MyTessel      94:57:a5:cc:99:87 tessel (Tessel 2)    11               -67.5

## License

[Apache License, Version 2.0](http://www.apache.org/licenses/LICENSE-2.0)
