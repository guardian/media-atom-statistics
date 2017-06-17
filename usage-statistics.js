#!/usr/bin/env node

const fs = require('fs');

require('console.table');
const json2csv = require('json2csv');

const CAPI = require('./capi');
const Config = require('./config');

console.log('CONFIGURATION');
console.table(Config.summary);

CAPI.getAtoms()
    .then(atoms => {
        const promises = atoms.reduce((promisesList, atom) => {
            promisesList.push(new Promise(resolve => {
                const atomType = atom.atomType;
                const atomData = atom.data[atomType];

                CAPI.getAtomUsage({atomId: atom.id, type: atomType}).then(usages => {

                    const result = {
                        id: atom.id,
                        created: atom.contentChangeDetails && atom.contentChangeDetails.created && new Date(atom.contentChangeDetails.created.date),
                        category: atomData.metadata && atomData.metadata.categoryId,
                        title: atomData.title,
                        timesUsed: usages.response.total,
                        placesUsed: usages.response.results.join(' ')
                    };

                    if (atomData.assets.length > 0 && atomData.activeVersion) {
                        const activeAsset = atomData.assets.find(asset => asset.version === atomData.activeVersion);
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

            console.log('OUTPUT');
            console.table(summary);

            const fields = ['id', 'created', 'category', 'title', 'timesUsed', 'placesUsed', 'youtubeId'];

            const csv = json2csv({data: result, fields: fields});

            const filename = `${Config.atomType}-statistics.csv`;

            fs.writeFile(filename, csv, (err) => {
                if (err) {
                    throw err;
                }
            });

            console.log(`${filename} created. Bye.`);
        });

    })
    .catch(err => console.log(err));
