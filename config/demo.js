import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const filename = fileURLToPath(import.meta.url);
const currentDir = dirname(filename);

const htmlCommonOptions = {
    favicon: './assets/favicon.ico',
    minify: {
        removeRedundantAttributes: false,
    },
};

const entryPoints = [
    'Button',
    'ChartGrid',
    'Checkbox',
    'Collapsible',
    'ColorUtils',
    'DateInput',
    'DatePicker',
    'Debug',
    'DecimalInput',
    'DpiTest',
    'DragnDrop',
    'DropDown',
    'EmptyClick',
    'Header',
    'Histogram',
    'Index',
    'Input',
    'InputGroup',
    'LineChart',
    'LinkMenu',
    'Menu',
    'Offcanvas',
    'Paginator',
    'PieChart',
    'Popup',
    'PopupMenu',
    'Progress',
    'Slider',
    'Switch',
    'TabList',
    'Tags',
    'WeekDaySelect',
];

export default {
    target: 'browserslist',
    context: resolve(currentDir, '../demo/src'),
    entry: {
        polyfills: '../../packages/jezvejs/src/js/polyfill/index.js',

        ...Object.fromEntries(entryPoints.map((name) => ([
            name, `./Views/${name}/${name}.js`,
        ]))),
    },
    output: {
        filename: 'demo/js/[name].[fullhash].js',
        assetModuleFilename: 'demo/assets/[name][ext]',
        path: resolve(currentDir, '../dist'),
        clean: true,
        library: {
            name: 'jezvejs',
            type: 'umd',
            umdNamedDefine: true,
        },
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                include: [
                    resolve(currentDir, '../demo/src'),
                    resolve(currentDir, '../node_modules/jezvejs'),
                ],
                exclude: /node_modules\/(?!(jezvejs)\/).*/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            babelrc: false,
                            rootMode: 'upward',
                        },
                    },
                    'astroturf/loader',
                ],
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
        ...entryPoints.map((name) => (new HtmlWebpackPlugin({
            template: `./Views/${name}/${name.toLowerCase()}.html`,
            filename: `demo/${name.toLowerCase()}.html`,
            chunks: ['polyfills', name],
            ...htmlCommonOptions,
        }))),
    ],
    cache: {
        type: 'filesystem',
    },
};
