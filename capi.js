const reqwest = require('reqwest');
const querystring = require('querystring');

const Config = require('./config');

class CAPI {
    static getAtoms() {
        function capiQuery({page}) {
            const query = {
                types: Config.atomType,
                'page-size': Config.pageSize,
                page: page,
                'api-key': Config.capiKey,
                'from-date': Config.fromDateAsString,
                'to-date': Config.toDateAsString
            };

            const url = `${Config.capiDomain}/atoms?${querystring.stringify(query)}`;

            const reqwestBody = {
                url: url,
                method: 'GET',
                contentType: 'application/json'
            };

            return reqwest(reqwestBody);
        }

        return new Promise((resolve, reject) => {
            capiQuery({page: 1})
                .then(initialResponse => {
                    const initialAtoms = initialResponse.response.results;
                    const totalPages = initialResponse.response.pages;

                    if (totalPages === 1) {
                        resolve(initialAtoms);
                    } else {
                        const promisesList = [];

                        let page = 2;
                        while (totalPages >= page) {
                            promisesList.push(capiQuery({page}));
                            page = page + 1;
                        }

                        Promise.all(promisesList)
                            .then(results => {
                                const remainingAtoms = results.reduce((allAtoms, capiResponse) => {
                                    const atoms = capiResponse.response.results;
                                    return allAtoms.concat(atoms);
                                }, []);

                                resolve(initialAtoms.concat(remainingAtoms));
                            })
                            .catch(err => reject(err));
                    }
                })
                .catch(err => reject(err));
        });
    }

    static getAtomUsage({atomId}) {
        const query = {
            'api-key': Config.capiKey,
            'page-size': Config.pageSize,
            'from-date': Config.fromDateAsString,
            'to-date': Config.toDateAsString
        };

        const url = `${Config.capiDomain}/atom/${Config.atomType}/${atomId}/usage?${querystring.stringify(query)}`;

        const requestBody = {
            url: url,
            method: 'GET',
            contentType: 'application/json'
        };

        return reqwest(requestBody);
    }
}

module.exports = CAPI;
