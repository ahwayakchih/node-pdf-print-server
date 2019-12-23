const http = require('http');
const url = require('url');

const include = require('./include');
const puppeteer = (process.env.CHROME_BIN && include('puppeteer-core')) || include('puppeteer') || null;

module.exports = createServer;

const MAX_WAIT_TIME = 2000;

function createServer (options) {
	if (!puppeteer) {
		console.error('Puppeteer not found');
		return null;
	}

	var browser = null;

	/* eslint-disable array-element-newline, multiline-comment-style */
	const browserLaunching = puppeteer.launch({
		headless       : true,
		executablePath : process.env.CHROME_BIN || null,
		defaultViewport: {
			width : 1024,
			height: 768
		},
		args: [
			'--lang=en,pl',
			'--no-sandbox',
			'--disable-setuid-sandbox',
			'--disable-gpu',
			'--disable-notifications',
			'--disable-software-rasterizer',
			// '--disable-dev-shm-usage', // This is part of default args
			'--hide-scrollbars',
			'--mute-audio'
			// `--disable-extensions-except=${cfg.crxPath}`, // This is for loading extension from sources, not from CRX file :/
			// `--load-extension=${cfg.crxPath}`, // This is for loading extension from sources, not from CRX file :/
			// '--system-developer-mode', // Run in developer mode
			// `--whitelisted-extension-id ${appId}`, // Adds the given extension ID to all the permission whitelists
		]
	})
	.then(launched => (browser = launched))
	.catch(console.error);
	/* eslint-enable array-element-newline, multiline-comment-style */

	const config = Object.assign({
		timeout: MAX_WAIT_TIME
	}, options);

	var server = http.createServer(async function (req, res) {
		const parsedURL = url.parse(req.url, true);
		const targetUrl = req.headers['x-print-pdf-url'] || parsedURL.query.url || null;
		if (!targetUrl) {
			res.writeHead(422, {
				'Content-Type': 'text/plain'
			});
			res.end('`x-print-pdf-url` header or `url` query parameter is required');
			return;
		}

		const page = await browser.newPage();
		page.goto(targetUrl, {
			'waitUntil': 'networkidle0',
			'referer': req.headers['referer'] || 'http://pdf-printer.local',
		})
			.then(() => {
				const selector = req.headers['x-wait-for-selector'] || parsedURL.query.selector || null;
				return selector ? page.waitForSelector(selector, config) : Promise.resolve();
			})
			.then(() => page.pdf({
				printBackground: true,
				format: 'A4',
				preferCSSPageSize: true
			}))
			.then(buf => {
				res.writeHead(200, {
					'Content-Type': 'application/pdf',
					'Content-Length': buf.length
				});
				res.write(buf);
			})
			.catch(err => {
				res.statusCode = 500;
				console.error(err);
			})
			.finally(() => {
				res.end();
				try {
					page.close().catch(console.error);
				}
				catch (err) {
					console.error(err);
				}
			});
	});

	server.on('close', () => browser && browser.close().catch(console.error));

	return server;
}
