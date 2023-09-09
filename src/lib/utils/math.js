module.exports = {
	/**
	 * Generate a random number between the two boundaries (inclusive).
	 * @param {number} [min = 0]
	 * @param {number} [max = 1]
	 * @returns {number}
	 */
	random: (min = 0, max = 1) => {
		min = parseFloat(min);
		max = parseFloat(max);
		return Math.round(Math.random() * (max - min)) + min;
	}
}
