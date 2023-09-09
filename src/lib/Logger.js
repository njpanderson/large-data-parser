class Logger {
	constructor(config) {
		this.config = config;
	}

	/**
	 * Write out a log message.
	 */
	write() {
		if (!this.config.verbose)
			return;

		console.log.apply(console, [...arguments]);
	}

	/**
	 * Write out an error.
	 * @param {Error} error
	 */
	error(error) {
		if ('getDetails' in error) {
			console.error(error.getDetails());
		} else {
			console.error(error.message);
		}

		// This could also log to some other place such as monolog, AWS logging solutions or a file
		// ...
	}
}

module.exports = Logger;
