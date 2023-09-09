const { parentPort } = require('node:worker_threads');

const Logger = require('./lib/Logger');
const Generate = require('./lib/Generate');
const config = require('./config');

if (typeof config !== 'object' || !config.filename) {
	console.error('Configuration file must exist at ./config.js. see ./config-example.js');
	process.exit(1);
}

const generate = new Generate(config);
const logger = new Logger(config);

generate.go().then((result) => {
	if (parentPort) {
		// Being run via a worker with a valid parent process
		parentPort.postMessage(JSON.stringify(formatResult(result)));
	} else {
		// Being run via CLI or other means
		logger.write('\nFile generation complete.');
		logger.write(formatResult(result));
	}
});

function formatResult(result) {
	content = result.docs.reduce((previous, current) => {
		return previous + `Document ${current.id}, items: ${current.length}, errors: ${current.errorCount}\n`;
	}, '');

	return content + '\n' + `File: ${result.file}`;
}
