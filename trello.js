'use strict';

const { URL } = require('url');


class ApiError extends Error {
	constructor(message, method, statusCode, data) {
		super(message);
		this.name = 'ApiError';
		this.method;
		this.statusCode = statusCode;
		this.data = data;
	}
	toString () {
		return [this.message, this.method, this.statusCode, this.data].join('::');
	}
}

class Trello {

	constructor	({ apiKey, apiToken }) {
		this.apiKey = apiKey;
		this.apiToken = apiToken;
	}

	async getBoardLists ({
		board,
	}) {
		return JSON.parse((await this.request('GET', `/boards/${board}/lists`)).data);
	}

	async createCard ({
		listId,
		name,
		description,
		position = 'bottom',
		labelIds = [],
	}) {
		await this.request('POST', '/cards', {
			idList: listId,
			name,
			desc: description,
			pos: position,
			idLabels: labelIds.join(','),
		});
	}

	async request (method, url, params = {}) {
		const trelloUrl = new URL(`https://api.trello.com/1${url}`);
		for (const name in params) {
			trelloUrl.searchParams.append(name, params[name]);
		}
		trelloUrl.searchParams.append('key', this.apiKey);
		trelloUrl.searchParams.append('token', this.apiToken);
		const result = await new Promise((resolve, reject) =>
			require(trelloUrl.protocol.split(':')[0]).request(trelloUrl, { method }, (res) => {
				const data = [];
				res.on('data', (chunk) => data.push(chunk));
				res.on('end', () => resolve({ statusCode: res.statusCode, data: data.join('') }));
			}).on('error', (err) => reject(err))
			.end()
		);
		if (result.statusCode < 200 || result.statusCode > 399) {
			throw new ApiError('Trello API Error', method, result.statusCode, result.data);
		}
		return result;
	}

}

Trello.CARD_DESCRIPTION_MAX_LENGTH = 11940;
module.exports = Trello;
