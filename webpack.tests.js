import webpack from 'webpack';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const htmlMinifyOptions = {
    removeRedundantAttributes: false
};

export default {
    mode: 'development',
    devtool: 'inline-source-map',
    target: ['web', 'es5'],
    entry: {
        polyfills: './src/js/polyfill/index.js',

        TestsView: {
            import: './demo/src/Tests/TestsView.js',
            filename: '[name].[fullhash].js',
        },
        testsMain: {
            import: './tests/index.js',
            filename: '[name].[fullhash].js',
        },
    },
    output: {
        filename: 'index.js',
        path: resolve(__dirname, 'dist/tests'),
        clean: true
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
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'demo/src/Tests/index.html',
            filename: 'index.html',
            chunks: ['polyfills', 'TestsView', 'testsMain'],
            minify: htmlMinifyOptions,
        }),
        new webpack.NormalModuleReplacementPlugin(
            /jezve-test\/NodeEnvironment/,
            'jezve-test\/BrowserEnvironment'
        ),
    ],
    optimization: {
        minimize: false,
    },
};
