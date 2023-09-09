class ParserError extends Error {
	constructor(message, documentId, userId) {
		super(message);
		this.documentId = documentId;
		this.userId = userId;
	}

	getDetails() {
		return `${this.message} - Document: ${
			this.documentId
		}, User: ${
			this.userId
		}`;
	}
}

module.exports = ParserError;
