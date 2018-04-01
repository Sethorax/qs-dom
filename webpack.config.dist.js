const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * WEBPACK CONFIG
 */
module.exports = env => {
    return {
        entry: {
            'q-dom': './src/styles.scss'
        },
        module: {
            rules: [
                {
                    test: /\.(css|sass|scss)$/,
                    exclude: /(bower_components)/,
                    use: [
                        MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: (env === 'dev'),
                            minimize: true
                        }
                    }, {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: (env === 'dev')
                        }
                    }, {
                        loader: 'postcss-loader'
                    }]
                }
            ]
        },
        mode: 'production',
        plugins: [
            new MiniCssExtractPlugin()
        ],
        output: {
            filename: '__tmp.js',
            path: path.resolve('./dist')
        }
    };
};