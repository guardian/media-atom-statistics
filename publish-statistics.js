#!/usr/bin/env node

const fs = require('fs');
require('console.table');

const json2csv = require('json2csv');
const moment = require('moment');

const CAPI = require('./capi');
const Config = require('./config');

console.log('CONFIGURATION');
console.table(Config.summary);

CAPI.getVideoPages()
    .then(pages => {
        const traditionalVideos = pages.traditional.reduce((videoPages, videoPage) => {
            videoPages.push({
                id: videoPage.id,
                publicationDate: moment.utc(new Date(videoPage.webPublicationDate)).format(Config.dateFormat),
                type: 'video-page'
            });

            return videoPages;
        }, []);

        CAPI.getAtoms()
            .then(atoms => {
                const mediaAtoms = atoms.reduce((allAtoms, atom) => {
                    const publicationDate = atom.contentChangeDetails
                        && atom.contentChangeDetails.published
                        && moment.utc(new Date(atom.contentChangeDetails.published.date)).format(Config.dateFormat);

                    allAtoms.push({
                        id: atom.id,
                        publicationDate: publicationDate,
                        type: 'media-atom'
                    });

                    return allAtoms;
                }, []);

                const fields = ['id', 'publicationDate', 'type'];

                const csv = json2csv({data: traditionalVideos.concat(mediaAtoms), fields: fields});

                const filename = `${Config.atomType}-publish-statistics.csv`;

                fs.writeFile(filename, csv, (err) => {
                    if (err) {
                        throw err;
                    }
                });

                const summary = {
                    traditionalVideosPublished: traditionalVideos.length,
                    atomsPublished: mediaAtoms.length,
                    atomVideoPagesPublished: pages.atomPowered.length
                };

                console.log('OUTPUT');
                console.table(summary);

                console.log(`${filename} created. Bye.`);
            });
    })
    .catch(err => console.log(err));
