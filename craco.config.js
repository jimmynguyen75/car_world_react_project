const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: { '@primary-color': '#FF7643', '@link-color': '#FF7643', '@border-radius-base': '2px'},
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};