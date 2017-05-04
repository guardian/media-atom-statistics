class Config {
    static get capiKey() {
        return process.env.CAPI_KEY;
    }

    static get capiDomain() {
        return process.env.CAPI_DOMAIN || 'https://content.guardianapis.com';
    }

    static get atomType() {
        return process.env.ATOM_TYPE || 'media';
    }
}

module.exports = Config;
