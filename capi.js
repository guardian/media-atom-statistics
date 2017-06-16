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

    static getVideoPages() {
        function capiQuery({page}) {
            const query = {
                'order-by': 'newest',
                'from-date': Config.fromDateAsString,
                'to-date': Config.toDateAsString,
                'show-atoms': 'all',
                'api-key': Config.capiKey,
                page: page,
                'page-size': Config.pageSize
            };

            const url = `${Config.capiDomain}/video?${querystring.stringify(query)}`;

            const reqwestBody = {
                url: url,
                method: 'GET',
                contentType: 'application/json'
            };

            return reqwest(reqwestBody);
        }

        function splitVideoPages(videoPages) {
            return videoPages.reduce((splitPages, videoPage) => {
                videoPage.atoms
                    ? splitPages.atomPowered.push(videoPage)
                    : splitPages.traditional.push(videoPage);
                return splitPages;
            }, {traditional: [], atomPowered: []});
        }


        return new Promise((resolve, reject) => {
            capiQuery({page: 1})
                .then(initialResponse => {
                   const initialVideoPages = initialResponse.response.results;
                   const totalPages = initialResponse.response.pages;

                   if (totalPages === 1) {
                       resolve(splitVideoPages(initialVideoPages));
                   } else {
                       const promiseList = [];

                       let page = 2;

                       while (totalPages >= page) {
                           promiseList.push(capiQuery({page}));
                           page = page + 1;
                       }

                       Promise.all(promiseList)
                           .then(results => {
                               const remainingVideoPages = results.reduce((allVideoPages, capiResponse) => {
                                   const videoPages = capiResponse.response.results;
                                   return allVideoPages.concat(videoPages);
                               }, []);

                               resolve(splitVideoPages(initialVideoPages.concat(remainingVideoPages)));
                           })
                           .catch(err => reject(err));
                   }
                });
        });
    }
}

module.exports = CAPI;
