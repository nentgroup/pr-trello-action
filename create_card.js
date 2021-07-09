'use strict';

const Trello = require('./trello');

module.exports = (trello) => ({

	fromPR: async (pullRequest, { listId, position = 'bottom', titleFormat = '${title}', labelIds = [] }) => {
		const {
			id,
			html_url: url,
			title,
			body,
		} = pullRequest;

		if (!['top', 'bottom'].includes(position)) {
			throw new Error(`Invalid position: ${position}. Must be one of top or bottom.`);
		}
		if (!listId) {
			throw new Error('listId is required.');
		}
		const description = (url + '\n\n' + body).substr(0, Trello.CARD_DESCRIPTION_MAX_LENGTH);

		await trello.createCard({
			name: titleFormat.replace('${title}', title),
			description,
			listId,
			position,
			labelIds,
		});
	},

});
