const path = require('path');

module.exports = {
    entry: './assets/js/script.js',
    output: {
        filename: 'global.js',
        path: path.resolve(__dirname, './assets/js/'),
    },
};