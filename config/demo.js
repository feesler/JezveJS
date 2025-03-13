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
    'ColorInput',
    'ColorUtils',
    'ControlledInput',
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
    'ListContainer',
    'Menu',
    'Offcanvas',
    'Paginator',
    'PieChart',
    'Popup',
    'PopupMenu',
    'PopupPosition',
    'Progress',
    'RangeScrollChart',
    'RangeSlider',
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
        polyfills: '../../packages/jezvejs/src/polyfill/index.js',

        ...Object.fromEntries(entryPoints.map((name) => ([
            name, `./Views/${name}/${name}.js`,
        ]))),
    },
    output: {
        filename: 'js/[name].[fullhash].js',
        assetModuleFilename: 'assets/[name][ext]',
        path: resolve(currentDir, '../dist'),
        clean: true,
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
                    {
                        loader: 'sass-loader',
                        options: {
                            api: 'modern',
                        },
                    },
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
            title: name,
            template: './Components/DemoView/template.html',
            filename: `${name.toLowerCase()}.html`,
            chunks: ['polyfills', name],
            ...htmlCommonOptions,
        }))),
    ],
    cache: {
        type: 'filesystem',
    },
};
