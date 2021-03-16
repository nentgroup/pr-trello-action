'use strict';

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

		await trello.createCard({
			name: titleFormat.replace('${title}', title),
			description: body + '\n\n' + url,
			listId,
			position,
			labelIds,
		});
	},

});
