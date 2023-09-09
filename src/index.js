const express = require('express');
const fs = require('fs');
const path = require('path');
const { Worker } = require('node:worker_threads');

const app = express();
const portNumber = 3000;

app.get('/', async (req, res) => {
	fs.readFile(path.join('public', 'index.html'), (err, file) => {
		if (err) throw err;
		res.send(file.toString());
	});
});

app.post('/generate', async (req, res) => {
	const worker = new Worker(path.join(__dirname, 'generate.js'));

	worker
		.on('message', (result) => {
			res.send(result);
		})
		.on('error', (error) => {
			res.status(500).send(error);
		});
});

app.use(express.static('public')).listen(portNumber);

console.log(`Parser interface loaded at http://localhost:${portNumber}/`);
