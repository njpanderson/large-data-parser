(function() {
	const post = async () => {
		// Send request to begin file generation
		const result = await fetch('/generate', {
			method: 'POST',
			mode: 'no-cors',
		});

		return result.json();
	}

	const button = document.getElementById('generate');
	let mutex = false;

	// Handle click event
	button.addEventListener('click', () => {
		const previousValue = button.innerHTML;

		if (mutex) {
			// Just some basic mutex, would be more complex and span multiple sessions in reality
			console.log('Cannot run more than once at a time');
			return;
		}

		mutex = true;

		button.innerHTML = 'Generating, please wait..';

		post().then((data) => {
			// Handle response
			output.innerHTML = data;
			button.innerHTML = previousValue;
			mutex = false;
		});
	});
}());
