# Create Trello cards from new PRs

This action creates a new trello card with details from newly opened pull requests (PR).

## Options

| Input | Description |
| ----- | ----------- |
| `api-key` | **Required**. The API key to use, see https://trello.com/app-key |
| `api-token` | **Required**. The API token to use, see https://trello.com/app-key |
| `list-id` | **Required**. ID of the list where to create the card. E.g: `603fa7d65a33890b500db093`. |
| `title-format` | Optional. Formatting of the card title. Available placeholders: `${title}`. <br/>Defaults to `${title}`. |
| `label-ids` | Optional. List of label ids (comma or newline separated) to assign to the cards created. |
| `position` | Optional. Where to put the new card, `top` or `bottom`. <br/> Defaults to `bottom`. |

List and label ids may be acquired by adding the extension `.json` to a board or card url and searching through the result.

## Example usage

### Basic
```yml
name: Create card from PR
on:
  pull_request_target:
    types:
      - opened

jobs:
  create-card:
    runs-on: ubuntu-latest
    steps:
      - name: create a card
        uses: nentgroup/pr-trello-card@v1
        with:
          api-key: '${{ secrets.TRELLO_API_KEY }}'
          api-token: '${{ secrets.TRELLO_API_TOKEN }}'
          list-id: '603fa7d65a33890b500db093'
```

### With custom title and labeling
```yml
name: Create card from PR
on:
  pull_request_target:
    types:
      - opened

jobs:
  create-card:
    runs-on: ubuntu-latest
    steps:
      - name: create a card
        uses: nentgroup/pr-trello-card@v1
        with:
          api-key: '${{ secrets.TRELLO_API_KEY }}'
          api-token: '${{ secrets.TRELLO_API_TOKEN }}'
          list-id: '603fa7d65a33890b500db093'
          title-format: 'PR: ${title}'
          label-ids: |
          603fa7cd184d2c731bb76ab2
          603fa7cd184d2c731bb76ab5
```
