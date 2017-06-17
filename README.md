# media-atom-statistics

Answering the question: how many media atoms have been created and how often have they been used?

## Setup
- Get Node 6+ (or run `nvm use`)
- Install requirements by running `yarn`

## Usage
### `get-usage`
```bash
export CAPI_KEY=key && yarn get-usage
```

### `get-published`
```bash
export CAPI_KEY=key && yarn get-published
```

## Configuration
The following environment variables can be set:
- `CAPI_KEY`
- `CAPI_DOMAIN` (defaults to https://content.guardianapis.com)
- `FROM_DATE` (defaults to start of month)
- `TO_DATE` (defaults to today)
