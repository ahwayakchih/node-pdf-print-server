const path = require('path');
const fs = require('fs');

/**
 * @module serve-files/lib/getOptionsFromArgv
 */
module.exports = getOptionsFromArgv;

/**
 * Parse array of arguments into object with hostname, port and documentRoot information.
 * Defaults result to 'localhost', 0 and current working directory.
 *
 * Ignores argument values that are equal to node.js binary path (`process.execPath`)
 * or main js file executed by node (`require.main.filename`), so it is safe to simply
 * pass `process.argv` to it.
 *
 * @example
 * var config = getOptionsFromArgv(process.argv);
 *
 * @alias module:serve-files/lib/getOptionsFromArgv
 * @param {string[]} argv
 * @return {object}
 */
function getOptionsFromArgv (argv) {
	const CWD = process.cwd();
	const BIN = process.execPath;
	const argc = argv.length;
	const main = require.main.filename;

	var result = {
		hostname    : null,
		port        : 0,
		documentRoot: CWD,
		usageText   : null
	};

	let value = false;
	let stats = false;

	for (let i = 0; i < argc; i++) {
		value = argv[i];
		stats = false;
		if (value === main || value === BIN) {
			continue;
		}
		if (value.match(/^\d+$/)) {
			result.port = parseInt(value, 10);
		}
		else if (value.indexOf(path.sep) !== -1 || value === '.' || value === '..') {
			result.documentRoot = value;
		}
		else if (value === 'localhost') {
			result.hostname = value;
		}
		else if (value === '--help' || value === '-h') {
			result.usageText = '[root_directory] [hostname[:port_number]] [port_number]';
		}
		else if ((stats = value.match(/^(\d+\.\d+\.\d+\.\d+)(:\d+|)$/)) || (stats = value.match(/^([^/:]+)(:\d+)$/))) {
			[value, result.hostname, result.port = 0] = stats;
			if (result.port) {
				result.port = parseInt(result.port.substring(1), 10) || 0;
			}
		}
		else {
			try {
				stats = fs.statSync(value);
				if (!stats || !stats.isDirectory()) {
					result.hostname = value;
				}
				else {
					result.documentRoot = value;
				}
			}
			catch (e) {
				result.hostname = value;
			}
		}
	}

	return result;
}
