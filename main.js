#!/usr/bin/env node

const fs = require('fs');

require('console.table');
const json2csv = require('json2csv');

const HMACRequest = require('./hmac');
const Usage = require('./usage');
const config = require('./config');

const hmac = new HMACRequest({sharedSecret: config.mediaAtom.secret});

hmac.get(`${config.mediaAtom.domain}/api2/atoms`).then(atoms => {

    const promises = atoms.reduce((promisesList, atom) => {

        promisesList.push(new Promise(resolve => {
            Usage.get({capiDomain: config.capi.domain, capiKey: config.capi.apiKey, atomId: atom.id}).then(usages => {

                const result = {
                    id: atom.id,
                    category: atom.category,
                    title: atom.title,
                    timesUsed: usages.response.total,
                    placesUsed: usages.response.results.join(' ')
                };

                if (atom.assets.length > 0 && atom.activeVersion) {
                    const activeAsset = atom.assets.find(asset => asset.version === atom.activeVersion);
                    result.youtubeId = activeAsset.id;
                }

                resolve(result);
            });
        }));

        return promisesList;
    }, []);

    Promise.all(promises).then(result => {
        const summary = {
            totalAtoms: result.length,
            totalUsages: result.reduce((total, i) => {return total + i.timesUsed}, 0)
        };

        console.table(summary);

        const fields = ['id', 'category', 'title', 'timesUsed', 'placesUsed', 'youtubeId'];

        const csv = json2csv({data: result, fields: fields});

        fs.writeFile('statistics.csv', csv, (err) => {
            if (err) {
                throw err;
            }
        });
    });
}).catch(err => {
    console.log(err);
});