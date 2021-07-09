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
		description: expect.stringContainingAllOf(
			pull_request.html_url,
			pull_request.body
		),
		position: 'bottom',
		labelIds: [],
	});

});

test('ensure card description is not exceeding the limit', async () => {
	const trello = new Trello();
	const { fromPR } = createCard(trello);
	const pull_request_too_big = {
		...pull_request,
		body: 'b'.repeat(Trello.CARD_DESCRIPTION_MAX_LENGTH),
		html_url: 'u'.repeat(100),
	};

	await fromPR(pull_request_too_big, { listId: 'my-list' });

	expect(trello.createCard).toHaveBeenCalledWith(
		expect.objectContaining({
			description: expect.toBeNoLongerThan(Trello.CARD_DESCRIPTION_MAX_LENGTH),
		})
	);
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


expect.extend({
	toBeNoLongerThan(received, length) {
		const pass = received.length <= length;
		if (pass) {
			return {
				message: () =>
					`expected length (${received.length}) not to be greater ${length}`,
				pass: true,
			};
		} else {
			return {
				message: () =>
					`expected length (${received.length}) to be at most ${length}`,
				pass: false,
			};
		}
	},

	stringContainingAllOf(received, ...parts) {
		try {
			for (const part of parts) {
				expect(received).toContain(part);
			}
		} catch (ex) {
			return ex;
		}
		return {
			message: () => `expected ${received} to contain all of ${parts}`,
			pass: true,
		};
	}
});
