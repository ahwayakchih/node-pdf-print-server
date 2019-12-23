/**
 * @module serve-files/lib/getSetOfSockets
 */
module.exports = createSetOfSockets;

/**
 * Net
 *
 * @external net
 * @see {@link https://nodejs.org/api/net.html#net_net}
 */

/**
 * Net socket
 *
 * @typedef external:net.Socket
 * @see {@link https://nodejs.org/api/net.html#net_class_net_socket}
 */

/**
 * Prepare new Set for sockets, and functions to manage it.
 *
 * @alias module:serve-files/lib/getSetOfSockets
 * @return {serve-files/lib/SetOfSockets}
 */
function createSetOfSockets () {
	const sockets = new Set();

	/**
	 * @private
	 * @this external:net.Socket
	 */
	function onSocketEnd () {
		sockets.delete(this);
	}

	/**
	 * Use this as a `connection` even handler.
	 * It will add socket to the set.
	 * It will attach `end` event handler to it, that will remove it from the Set.
	 *
	 * @param {external:net.Socket} socket
	 */
	function onNewConnection (socket) {
		sockets.add(socket);
		socket.on('end', onSocketEnd);
	}

	/**
	 * Close all sockets in the set.
	 */
	function closeAll () {
		sockets.forEach(socket => {
			socket.end();
			socket.destroy();
		});
	}

	/**
	 * @typedef {object} serve-files/lib/SetOfSockets
	 * @property {Set}      sockets
	 * @property {Function} onNewConnection
	 * @property {Function} closeAll
	 */
	return {
		sockets,
		onNewConnection,
		closeAll
	};
}
