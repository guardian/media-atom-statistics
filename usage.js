const reqwest = require('reqwest');

class Usage {
    static get({capiDomain, capiKey, atomId, pageSize = 50}) {
        const requestBody = {
            url: `${capiDomain}/atom/media/${atomId}/usage?api-key=${capiKey}&page-size=${pageSize}`,
            method: 'GET',
            contentType: 'application/json'
        };

        return reqwest(requestBody);
    }
}

module.exports = Usage;