import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    target: 'browserslist',
    context: resolve(__dirname, '../packages/jezvejs/src/'),
    entry: {
        index: './js/index.js',
        polyfills: './js/polyfill/index.js',
        BaseChart: './Components/BaseChart/BaseChart.js',
        ChartGrid: './Components/ChartGrid/ChartGrid.js',
        Checkbox: './Components/Checkbox/Checkbox.js',
        Collapsible: './Components/Collapsible/Collapsible.js',
        DateInput: './Components/DateInput/DateInput.js',
        DatePicker: './Components/DatePicker/DatePicker.js',
        Debug: './Components/Debug/Debug.js',
        DecimalInput: './Components/DecimalInput/DecimalInput.js',
        DragnDrop: './Components/DragnDrop/DragnDrop.js',
        Histogram: './Components/Histogram/Histogram.js',
        IndetermProgress: './Components/IndetermProgress/IndetermProgress.js',
        InputGroup: './Components/InputGroup/InputGroup.js',
        LineChart: './Components/LineChart/LineChart.js',
        Offcanvas: './Components/Offcanvas/Offcanvas.js',
        Paginator: './Components/Paginator/Paginator.js',
        PieChart: './Components/PieChart/PieChart.js',
        Popup: './Components/Popup/Popup.js',
        Progress: './Components/Progress/Progress.js',
        Radio: './Components/Radio/Radio.js',
        Slider: './Components/Slider/Slider.js',
        Sortable: './Components/Sortable/Sortable.js',
        Spinner: './Components/Spinner/Spinner.js',
        Switch: './Components/Switch/Switch.js',
    },
    output: {
        filename: '[name].js',
        path: resolve(__dirname, '../dist'),
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
