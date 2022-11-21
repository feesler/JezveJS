import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    target: 'browserslist',
    context: resolve(__dirname, '../packages/jezvejs/'),
    entry: {
        index: './index.js',
        polyfills: './src/js/polyfill/index.js',
        BaseChart: './src/Components/BaseChart/BaseChart.js',
        ChartGrid: './src/Components/ChartGrid/ChartGrid.js',
        Checkbox: './src/Components/Checkbox/Checkbox.js',
        Collapsible: './src/Components/Collapsible/Collapsible.js',
        DateInput: './src/Components/DateInput/DateInput.js',
        DatePicker: './src/Components/DatePicker/DatePicker.js',
        Debug: './src/Components/Debug/Debug.js',
        DecimalInput: './src/Components/DecimalInput/DecimalInput.js',
        DragnDrop: './src/Components/DragnDrop/DragnDrop.js',
        Histogram: './src/Components/Histogram/Histogram.js',
        IndetermProgress: './src/Components/IndetermProgress/IndetermProgress.js',
        InputGroup: './src/Components/InputGroup/InputGroup.js',
        LineChart: './src/Components/LineChart/LineChart.js',
        Offcanvas: './src/Components/Offcanvas/Offcanvas.js',
        Paginator: './src/Components/Paginator/Paginator.js',
        PieChart: './src/Components/PieChart/PieChart.js',
        Popup: './src/Components/Popup/Popup.js',
        Progress: './src/Components/Progress/Progress.js',
        Radio: './src/Components/Radio/Radio.js',
        Slider: './src/Components/Slider/Slider.js',
        Sortable: './src/Components/Sortable/Sortable.js',
        Spinner: './src/Components/Spinner/Spinner.js',
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
