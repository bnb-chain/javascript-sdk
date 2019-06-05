# Binance Chain JavaScript SDK

The Binance Chain JavaScript SDK allows browsers and node.js clients to interact with Binance Chain. It includes the following core components:

* **crypto** - core cryptographic functions.
* **amino** - [amino](https://github.com/binance-chain/docs-site/blob/master/docs/encoding.md) (protobuf-like) encoding and decoding of transactions.
* **client** - implementations of Binance Chain transaction types, such as for transfers and trading.
* **accounts** - management of "accounts" and wallets, including seed and encrypted mnemonic generation.
* **ledger** - Ledger Nano S/X support via HID, U2F and Web BLE (Bluetooth).
* **rpc** - RPC client, coming soon.

# Installation

Important, please follow the instructions for your OS below:

**Windows users:** Please install [windows-build-tools](https://www.npmjs.com/package/windows-build-tools) first.

**Mac users:** Make sure XCode Command Line Tools are installed: `xcode-select --install`.

**Linux users:** Note that Ubuntu Xenial and newer distributions are recommended, especially when using Travis or other CI systems. You may need some dev packages to be installed on your system for USB support. On Debian-based distributions (like Ubuntu) you should install them with this command:
```bash
$ sudo apt-get install libudev-dev libusb-dev usbutils
```

### Install the NPM package
```bash
$ npm i @binance-chain/javascript-sdk
```

### Use with Webpack

We often see Webpack builds failing with the SDK due to the `usb` dependency, but adding this to your Webpack config should fix that:
```js
module.exports = {
  plugins: [new webpack.IgnorePlugin(/^usb$/)]
}
```
or
```js
config.plugins.push(new webpack.IgnorePlugin(/^usb$/))
```

# API

For up-to-date API documentation, please check the [wiki](https://github.com/binance-chain/javascript-sdk/wiki).

# Testing

All new code changes should be covered with unit tests. You can run the tests with the following command:

```bash
$ npm run test
```

Tests for the Ledger hardware wallet integration have their own suite that runs in both node and in the browser:

```bash
$ npm run test:ledger
$ npm run test:ledger:browser
```

# Contributing

Contributions to the Binance Chain JavaScript SDK are welcome. Please ensure that you have tested the changes with a local client and have added unit test coverage for your code.
