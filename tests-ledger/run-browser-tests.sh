#!/bin/bash

echo "Building SDK"
yarn build
echo ""

echo "Browserifying Buffer polyfill"
yarn browserify node_modules/buffer/index.js --im --s=Buffer -o tests-ledger/buffer-polyfill.js
echo ""

echo "Browserifying Ledger sources"
yarn browserify tests-ledger/index-browser.js --im --s=SDK -o tests-ledger/ledger-bundle.js
echo ""

if [[ ! -e ./cert.pem ]]; then
  echo "Generating https keypair (https is required for U2F communication)"
  echo ""
  echo "READ THIS: Please enter 'US' in the Country Name field, and press ENTER to leave the rest blank."
  echo ""
  openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
  echo ""
fi

echo "Starting the https web server. Please accept the browser security warning"
yarn http-server tests-ledger/ -o --ssl
echo ""
