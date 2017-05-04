# media-atom-statistics

Answering the question: how many media atoms have been created and how often have they been used?

## Usage
- `nvm use`
- `npm install`
- `npm run get-statistics`

A csv file will be created in the current directory outlining:
- id
- category
- title
- timesUsed
- placesUsed
- youtubeId

## Configuration
The following environment variables can be set:
- `ATOM_TYPE`
- `CAPI_DOMAIN`
- `CAPI_KEY`
