import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const currentDir = dirname(filename);

const entryPoints = [
    'BaseChart',
    'Button',
    'ChartGrid',
    'Checkbox',
    'CloseButton',
    'Collapsible',
    'ControlledInput',
    'DateInput',
    'DatePicker',
    'Debug',
    'DecimalInput',
    'DragnDrop',
    'DropDown',
    'Header',
    'HeaderMenuButton',
    'Histogram',
    'Icon',
    'IndetermProgress',
    'Input',
    'InputGroup',
    'LineChart',
    'LinkMenu',
    'ListContainer',
    'Menu',
    'MenuButton',
    'Notification',
    'Offcanvas',
    'Paginator',
    'PieChart',
    'Popup',
    'PopupMenu',
    'PopupPosition',
    'Progress',
    'Radio',
    'RangeScrollChart',
    'RangeSlider',
    'ScrollLock',
    'Slidable',
    'Slider',
    'Sortable',
    'SortableListContainer',
    'Spinner',
    'Store',
    'Switch',
    'TabList',
    'Tag',
    'Tags',
    'View',
    'WeekDaySelect',
];

export default {
    target: 'browserslist',
    context: resolve(currentDir, '../packages/jezvejs/'),
    entry: {
        index: './index.js',
        polyfills: './src/polyfill/index.js',

        ...Object.fromEntries(entryPoints.map((name) => ([
            name, `./src/Components/${name}/${name}.js`,
        ]))),
    },
    output: {
        filename: '[name].js',
        path: resolve(currentDir, 'dist'),
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
    cache: {
        type: 'filesystem',
    },
};
