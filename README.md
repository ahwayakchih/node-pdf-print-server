PDF Print server
================

Run a simple HTTP server, that awaits requests with URL parameter, loades website from that URL and respondes with PDF file.

## Requirements

This project depends on [Node.js](https://nodejs.org/) v12+.

It also depends on Chrome or Chromium browser. If you do not want to install additional Chrome with this module, make sure that there is a `CHROME_BIN` environmental variable set, pointing to browser executable.

## Installation

Since this is a private project (at least at the moment), clone it, go to its directory and install it:

```sh
git clone git@github.com:ahwayakchih/node-pdf-print-server.git
cd node-pdf-print-server
npm install --production
```

## Starting server

Start server from command line:

```sh
npm start 0.0.0.0:8080
```

That will start server listening for connections on any hostname, on port `8080`.

## Usage

Simply request server by passign additional `url` query parameter:

```sh
curl -o test.pdf http://localhost:8080/?url=https://nodejs.org
```

or `x-print-pdf-url` HTTP header:

```sh
curl -o test.pdf -H 'x-print-pdf-url: https://nodejs.org' http://localhost:8080
```

