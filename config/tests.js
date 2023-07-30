import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const filename = fileURLToPath(import.meta.url);
const currentDir = dirname(filename);

const htmlMinifyOptions = {
    removeRedundantAttributes: false,
};

export default {
    mode: 'development',
    devtool: 'inline-source-map',
    target: ['web', 'es5'],
    context: resolve(currentDir, '..'),
    entry: {
        polyfills: './packages/jezvejs/src/js/polyfill/index.js',

        TestsView: './demo/src/Views/Tests/TestsView.js',
        testsMain: './tests/index.js',
    },
    output: {
        filename: '[name].[fullhash].js',
        path: resolve(currentDir, '../dist/tests'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: ['babel-loader', 'astroturf/loader'],
            },
            {
                test: /\.(scss|css)$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'demo/src/Views/Tests/index.html',
            filename: 'index.html',
            chunks: ['polyfills', 'TestsView', 'testsMain'],
            minify: htmlMinifyOptions,
        }),
        new webpack.NormalModuleReplacementPlugin(
            /jezve-test\/NodeEnvironment/,
            'jezve-test/BrowserEnvironment',
        ),
    ],
    optimization: {
        minimize: false,
    },
};
