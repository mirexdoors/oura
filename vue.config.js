const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
    "transpileDependencies": [
        "vuetify"
    ],
    chainWebpack(config) {
        config.plugin('CompressionPlugin').use(CompressionPlugin);
    }
};
