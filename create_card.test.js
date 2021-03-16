'use strict';

const createCard = require('./create_card');
const Trello = require('./trello');

jest.mock('./trello');
beforeEach(() => Trello.mockClear());

const { pull_request } = require('./payloads/pull_request_opened.json');

test('basic example', async () => {
	const trello = new Trello();
	const { fromPR } = createCard(trello);

	await fromPR(pull_request, { listId: 'my-list' });

	expect(trello.createCard).toHaveBeenCalledWith({
		listId: 'my-list',
		name: pull_request.title,
		description: pull_request.body + '\n\n' + pull_request.html_url,
		position: 'bottom',
		labelIds: [],
	});

});


describe('input validation', () => {

	test.each([
		'top',
		'bottom',
	])('valid position: %s', async (position) => {
		const trello = new Trello();
		const { fromPR } = createCard(trello);
		const params = { listId: 'some-list', position };
		await expect(fromPR(pull_request, params)).resolves.not.toThrow();
	});
	test('invalid position', async () => {
		const trello = new Trello();
		const { fromPR } = createCard(trello);
		const params = { listId: 'some-list', position: 'middle' };
		await expect(fromPR(pull_request, params)).rejects.toThrow();
	});

	test('listId is required', async () => {
		const trello = new Trello();
		const { fromPR } = createCard(trello);
		const params = {};
		await expect(fromPR(pull_request, params)).rejects.toThrow();
	});

});
