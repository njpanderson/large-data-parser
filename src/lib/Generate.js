'use strict';

const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');

const ParserError = require('../exceptions/ParserError');
const Logger = require('./Logger');
const { random } = require('./utils/math');

class Generate {
	constructor(config) {
		// Set configuration from file. This could also be command line
		// arguments (process.argv), .env, or any other method as long as
		// they're not stored in code.
		// Note: in the case of CLI args, any privileged info would have to be
		// piped in to avoid storing the data in unix shell histories, etc.
		this.config = config;
		this.logger = new Logger(config);

		this.stream = null;
	}

	/**
	 * Start output generation
	 * @returns Promise
	 */
	go() {
		return new Promise((resolve) => {
			// Number of fake docs to source from
			const docCount = 10;

			// Compute file to write to
			const writeFile = path.join(this.config.path, this.config.filename);

			const result = {
				docs: [],
				file: writeFile
			};

			try {
				// Open file stream
				this.stream = fs.createWriteStream(writeFile);

				// Write csv headers
				this.stream.write('doc,id,userName,email\n');
			} catch(error) {
				this.logger.error(error);

				// Rethrow as this is unrecoverable
				throw error;
			}

			let currentDocId = 1;

			// Run parseDoc for each "document"
			const parseDoc = () => {
				// Number of "rows" within the document
				const rowCount = random(500000, 1250000);
				const doc = { id: currentDocId, length: rowCount, errorCount: 0 };

				this.logger.write(`Generate#go - Parsing ${rowCount} items from doc ${currentDocId}`);

				this.generateRows(doc)
					.then((docResult) => {
						result.docs.push(docResult);

						this.logger.write(`Generate#go - - Doc ${currentDocId} - Done`);

						// Increment document ID
						currentDocId += 1;

						if (currentDocId <= docCount) {
							parseDoc();
						} else {
							this.logger.write('Generate#go – Completed!');

							resolve(result);
							this.stream.close();
						}
					});
			};

			parseDoc();
		});
	}

	/**
	 * Generate the required rows from this "document"
	 * @param {object} doc
	 * @param {Stream} stream
	 * @returns
	 */
	generateRows(doc) {
		return new Promise((resolve) => {
			let rowsToWrite = doc.length;

			// Create a function to call recursively while there is data to write
			const write = () => {
				let writeable = true;

				// Loop while stream buffer is free
				do {
					rowsToWrite -= 1;
					const uuid = faker.string.uuid();

					try {
						if (random(0, 200000) > 199999) {
							// Small chance to produce an error here
							throw new Error('Sample error!');
						}

						// Write out single CSV line
						// Note: this would use a real CSV writing engine to handle quoting, escaping etc
						// (Presuming it would be compatible with Stream)
						writeable = this.stream.write(
							`${doc.id},${uuid},"${
								faker.internet.userName()
							}","${
								faker.internet.email()
							}"\n`
						);
					} catch(error) {
						this.logger.error(new ParserError(error.message, doc.id, uuid));
						doc.errorCount += 1;
					}

					if (rowsToWrite === 0) {
						resolve(doc);
					}
				} while (rowsToWrite > 0 && writeable)

				// This point is reached once rowsToWrite is 0 or writeable is false (buffer full)
				if (rowsToWrite > 0) {
					// There are remaining rows to write out and the write buffer is full
					// re-call internal write function once buffer is drained
					this.stream.once('drain', write);
				}
			};

			write();
		});
	}
}

module.exports = Generate;
