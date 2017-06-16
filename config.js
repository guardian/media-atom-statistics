const moment = require('moment');

class Config {
    static get capiKey() {
        return process.env.CAPI_KEY;
    }

    static get capiDomain() {
        return process.env.CAPI_DOMAIN || 'https://content.guardianapis.com';
    }

    static get atomType() {
        return 'media';
    }

    static get fromDateAsString() {
        const startOfMonth = moment().startOf('month');

        const fromDate = process.env.FROM_DATE
            ? moment(new Date(process.env.FROM_DATE))
            : startOfMonth;

        const date = fromDate.isValid()
            ? fromDate
            : startOfMonth;

        return date.format(Config.dateFormat);
    }

    static get toDateAsString() {
        const toDate = process.env.TO_DATE
            ? moment(new Date(process.env.TO_DATE))
            : moment();

        const date = toDate.isValid()
            ? toDate
            : moment();

        return date.format(Config.dateFormat);
    }

    static get dateFormat() {
        return 'YYYY-MM-DD';
    }

    static get pageSize() {
        return process.env.PAGE_SIZE || 100;
    }
}

module.exports = Config;
