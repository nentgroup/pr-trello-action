'use strict';

const core = require('@actions/core');
const github = require('@actions/github');
const Trello = require('./trello');

const run = async () => {
	try {
		const { action, pull_request } = github.context.payload;
		if (action !== 'opened') {
			return;
		}
		const trello = new Trello({
			apiKey: core.getInput('api-key'),
			apiToken: core.getInput('api-token'),
		});
		const createCard = require('./create_card')(trello);
		const params = {
			listId: core.getInput('list-id'),
			position: core.getInput('position'),
			titleFormat: core.getInput('title-format'),
			labelIds: core.getInput('label-ids').split(/[,\n]/).filter(Boolean),
		};
		await createCard.fromPR(pull_request, params);
	} catch (error) {
		core.error(error);
		core.setFailed(error.message);
	}
};

run();
