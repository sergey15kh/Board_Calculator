const path = require('path');

module.exports = {
    entry: './assets/js/script.js',
    output: {
        filename: 'global.js',
        path: path.resolve(__dirname, 'assets', 'js'),
    },
    // Добавьте модуль и правила, если вы используете Babel или другие загрузчики
    module: {
        rules: [
            // Правила для Babel, CSS, изображений и т.д.
        ]
    },
    // Другие настройки Webpack
};
