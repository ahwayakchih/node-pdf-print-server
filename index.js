const printServer = require('./lib/printServer');
const parseArguments = require('./lib/getOptionsFromArgv.js');
const connections = require('./lib/getSetOfSockets.js')();

const CONFIG = parseArguments(process.argv);

if (CONFIG.usageText !== null) {
	console.log(`USAGE: ${path.basename(module.filename)} ${CONFIG.usageText}\n`);
	process.exit(0); // eslint-disable-line no-process-exit
}

const server = printServer(CONFIG);
if (!server) {
	process.exit(-1);
}

server.listen(CONFIG.port, CONFIG.hostname, null, onServerListening);

// Keep track of connections, to enforce killing them when server must be stopped.
server.on('connection', connections.onNewConnection);

[
	'SIGHUP',
	'SIGINT',
	'SIGQUIT',
	'SIGILL',
	'SIGTRAP',
	'SIGABRT',
	'SIGBUS',
	'SIGFPE',
	'SIGUSR1',
	'SIGSEGV',
	'SIGUSR2',
	'SIGTERM'
].forEach(signal => process.once(signal, onServerSignal));

/**
 * Net server
 *
 * @typedef external:net.Server
 * @see {@link https://nodejs.org/api/net.html#net_class_net_server}
 */

/**
 * Output some info about server that's listening.
 *
 * @private
 * @this external:net.Server
 */
function onServerListening () {
	const address = this.address();
	console.log(`Listening on http://${address.address}:${address.port}`);
}

/**
 * Quickly stop server on signal.
 *
 * @private
 * @param {string} signal
 */
function onServerSignal (signal) {
	console.log(`Got ${signal}, stopping server...`);
	server.close(() => {
		console.log('Server stopped. Bye!');
		process.exit(0); // eslint-disable-line no-process-exit
	});

	connections.closeAll();
}
