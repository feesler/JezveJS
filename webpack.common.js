import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    target: 'browserslist',
    entry: {
        index: './src/js/index.js',

        polyfills: './src/js/polyfill/index.js',
        Checkbox: './src/Components/Checkbox/Checkbox.js',
        Collapsible: './src/Components/Collapsible/Collapsible.js',
        DateInput: './src/Components/DateInput/DateInput.js',
        DecimalInput: './src/Components/DecimalInput/DecimalInput.js',
        DropDown: './src/Components/DropDown/DropDown.js',
        DatePicker: './src/Components/DatePicker/DatePicker.js',
        DragMaster: './src/Components/DragnDrop/DragMaster.js',
        DragAvatar: './src/Components/DragnDrop/DragAvatar.js',
        DragZone: './src/Components/DragnDrop/DragZone.js',
        DropTarget: './src/Components/DragnDrop/DropTarget.js',
        IndetermProgress: './src/Components/IndetermProgress/IndetermProgress.js',
        InputGroup: './src/Components/InputGroup/InputGroup.js',
        Sortable: './src/Components/Sortable/Sortable.js',
        Histogram: './src/Components/Charts/Histogram.js',
        LineChart: './src/Components/Charts/LineChart.js',
        Offcanvas: './src/Components/Offcanvas/Offcanvas.js',
        Paginator: './src/Components/Paginator/Paginator.js',
        PieChart: './src/Components/PieChart/PieChart.js',
        Popup: './src/Components/Popup/Popup.js',
        Progress: './src/Components/Progress/Progress.js',
        Radio: './src/Components/Radio/Radio.js',
        Slider: './src/Components/Slider/Slider.js',
        Switch: './src/Components/Switch/Switch.js',
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, 'dist'),
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
        ]
    },
    cache: {
        type: 'filesystem',
    },
};
