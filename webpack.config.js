const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');

/**
 * WEBPACK CONFIG
 */
module.exports = env => {
    return {
        entry: {
            'q-dom': (env === 'production') ? './src/index.js' : './build/entry.js'
        },
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: new RegExp(`node_modules`),
                    use: {
                        loader: 'babel-loader'
                    }
                }
            ]
        },
        mode: (env === 'dev') ? 'development' : 'production',
        plugins: [],
        externals: (env === 'dev') ? {} : nodeExternals(),
        resolve: {
            extensions: ['.js', '.jsx']
        },
        output: {
            filename: '[name].js',
            chunkFilename: '[name].js',
            path: path.resolve('./dist')
        }
    };
};