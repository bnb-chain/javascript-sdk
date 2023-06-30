The BNB Beacon Chain JavaScript SDK allows browsers and Node.js clients to interact
with BNB Beacon Chain. It includes the following core components.

- **crypto** - core cryptographic functions.
- **amino** -
  [amino](https://github.com/binance-chain/docs-site/blob/master/docs/encoding.md)
  (protobuf-like) encoding and decoding of transactions.
- **client** - implementations of BNB Beacon Chain transaction types, such as for
  transfers and trading.
- **accounts** - management of "accounts" and wallets, including seed and
  encrypted mnemonic generation.
- **ledger** - Ledger Nano S/X support via HID, U2F and Web BLE (Bluetooth).
- **rpc** - Node RPC client.
- **transaction** - Transaction Class, build and sign.

You can find more detailed documentation and examples in our
[Documentation](https://github.com/binance-chain/javascript-sdk/blob/master/docs/README.md)
pages.

## Installation

If you **do not** need Ledger support with Node.js:

```bash
$ npm i @binance-chain/javascript-sdk --no-optional
# Or:
$ yarn add @binance-chain/javascript-sdk --no-optional
```

If you **need** Ledger support with Node.js:

```bash
$ npm i @binance-chain/javascript-sdk
# Or:
$ yarn add @binance-chain/javascript-sdk
```

### Prerequisites

- **Windows users:** Please install
  [windows-build-tools](https://www.npmjs.com/package/windows-build-tools)
  first.

- **Mac users:** Make sure XCode Command Line Tools are installed:
  `xcode-select --install`.

- **Linux users:** Note that Ubuntu Xenial and newer distributions are
  recommended, especially when using Travis or other CI systems. You may need
  some dev packages to be installed on your system for USB support. On
  Debian-based distributions (like Ubuntu) you should install them with this
  command:

  ```bash
  $ sudo apt-get install libudev-dev libusb-dev usbutils
  ```

### Use with Webpack

We often see Webpack builds failing with the SDK due to the `usb` dependency,
but adding this to your Webpack config should fix that:

```js
module.exports = {
  plugins: [new webpack.IgnorePlugin(/^usb$/)],
}
```

## Testing

All new code changes should be covered with unit tests. You can run the tests
with the following command:

```bash
$ yarn test
```

Tests for the Ledger hardware wallet integration have their own suite that runs
in both node and in the browser:

```bash
$ yarn test:ledger
$ yarn test:ledger:browser
```

## Contributing

Contributions to the BNB Beacon Chain JavaScript SDK are welcome. Please ensure
that you have tested the changes with a local client and have added unit test
coverage for your code.
