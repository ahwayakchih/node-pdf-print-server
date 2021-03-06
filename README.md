PDF Print server
================

Run a simple HTTP server, that awaits requests with URL parameter, loades website from that URL and respondes with PDF file.

## Requirements

This project depends on [Node.js](https://nodejs.org/) v12+.

It also depends on Chrome or Chromium browser. If you do not want to install additional Chrome with this module, make sure that there is a `CHROME_BIN` environmental variable set, pointing to browser executable.

You can also run it using Docker or Podman, in which case no installation will be necessary (skip the "Installation" step).

## Installation

Since this is a private project (at least at the moment), clone it, go to its directory and install it:

```sh
git clone git@github.com:ahwayakchih/node-pdf-print-server.git
cd node-pdf-print-server
npm install --production
```

If you have Chrome or Chromium browser enabled, set `CHROME_BIN` environment variable pointing to its executable and install "thin" version of `puppeteer` module:

```sh
npm install --no-save puppeteer-core
```

Otherwise, install "full" version of `puppeteer` module (which will include local installation of Chrome browser):

```sh
npm install --no-save puppeteer
```

## Starting server (native)

Start server from command line:

```sh
npm start 0.0.0.0:8080
```

That will start server listening for connections on any hostname, on port `8080`.

If you want to hide it behind some reverse-proxy (that could also serve as SSL terminator), you can run server as localhost only instead:

```sh
npm start localhost:8080
```

## Starting server (docker)

```sh
docker run --rm -v ~/www/pdf-printer:/app -p 8080:8080 -it ahwayakchih/nodeapp:puppeteer /bin/sh -c "npm install --production && npm start 0.0.0.0:8080"
```

## Starting server (podman)

```sh
podman run --rm --userns=keep-id -v ./:/app -p 8080:8080 -it ahwayakchih/nodeapp:puppeteer /bin/sh -c "npm install --production && npm start 0.0.0.0:8080"
```

## Usage

Simply request server by passign additional `url` query parameter:

```sh
curl -o test.pdf http://localhost:8080/?url=https://nodejs.org
```

or `x-print-pdf-url` HTTP header:

```sh
curl -o test.pdf -H 'x-print-pdf-url: https://nodejs.org' http://localhost:8080
```
