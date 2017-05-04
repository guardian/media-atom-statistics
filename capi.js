const reqwest = require('reqwest');

const Config = require('./config');

class CAPI {
    static getAtoms({pageSize = 200}) {
        function capiQuery({pageSize, page}) {
            const reqwestBody = {
                url: `${Config.capiDomain}/atoms?types=${Config.atomType}&page-size=${pageSize}&page=${page}&&api-key=${Config.capiKey}`,
                method: 'GET',
                contentType: 'application/json'
            };

            return reqwest(reqwestBody);
        }

        return new Promise((resolve, reject) => {
            capiQuery({pageSize, page: 1})
                .then(initialResponse => {
                    const initialAtoms = initialResponse.response.results;
                    const totalPages = initialResponse.response.pages;

                    if (totalPages === 1) {
                        resolve(initialAtoms);
                    } else {
                        const promisesList = [];

                        let page = 2;
                        while (totalPages >= page) {
                            promisesList.push(capiQuery({pageSize, page}));
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

    static getAtomUsage({atomId, pageSize = 50}) {
        const requestBody = {
            url: `${Config.capiDomain}/atom/${Config.atomType}/${atomId}/usage?api-key=${Config.capiKey}&page-size=${pageSize}`,
            method: 'GET',
            contentType: 'application/json'
        };

        return reqwest(requestBody);
    }
}

module.exports = CAPI;
