const path = require('path');

module.exports = {
    entry: './js/script.js',
    output: {
        filename: 'global.js',
        path: path.resolve(__dirname, './js/'),
    },
};