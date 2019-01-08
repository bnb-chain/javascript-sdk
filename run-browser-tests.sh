#!/bin/bash

echo "Browserify ledger sources"
yarn browserify src/ledger/index-browser.js --im --s=Ledger -o browser-tests/ledger.js

if [[ ! -e ./cert.pem ]]; then
  echo "Generate https keypair (https is required for U2F communication)"
  openssl req -newkey rsa:2048 -new -nodes -x509 -days 3650 -keyout key.pem -out cert.pem
fi

echo "Starting the https web server. Browse to https://localhost:8080"
yarn http-server browser-tests/ --ssl
