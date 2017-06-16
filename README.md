# media-atom-statistics

Answering the question: how many media atoms have been created and how often have they been used?

## Usage
- `nvm use`
- `yarn`
- Set `CAPI_KEY` environment variable
- `yarn get-usage`

A csv file will be created in the current directory outlining:
- id
- created
- category
- title
- timesUsed
- placesUsed
- youtubeId

## Configuration
The following environment variables can be set:
- `CAPI_DOMAIN`
- `CAPI_KEY`
