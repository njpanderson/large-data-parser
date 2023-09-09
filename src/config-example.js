// Copy this file as config.js in the same folder
const path = require('path');

module.exports = {
	filename: 'collated-data.csv', // Output file name
	path: path.dirname(), // Directory for the output file
	verbose: true, // Write output as well as errors
	// Unused options but could exist in real world
	sourceGlob: '/some/path/**/*.ext', // Where to source the input files
	notify: 'someone@somewhere.com' // (or an HTTP endpoint, webhook, etc)
};
