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
        Checkbox: './Components/Checkbox/Checkbox.js',
        Collapsible: './Components/Collapsible/Collapsible.js',
        DateInput: './Components/DateInput/DateInput.js',
        DecimalInput: './Components/DecimalInput/DecimalInput.js',
        DropDown: './Components/DropDown/DropDown.js',
        DatePicker: './Components/DatePicker/DatePicker.js',
        DragMaster: './Components/DragnDrop/DragMaster.js',
        DragAvatar: './Components/DragnDrop/DragAvatar.js',
        DragZone: './Components/DragnDrop/DragZone.js',
        DropTarget: './Components/DragnDrop/DropTarget.js',
        IndetermProgress: './Components/IndetermProgress/IndetermProgress.js',
        InputGroup: './Components/InputGroup/InputGroup.js',
        Sortable: './Components/Sortable/Sortable.js',
        Histogram: './Components/Charts/Histogram.js',
        LineChart: './Components/Charts/LineChart.js',
        Offcanvas: './Components/Offcanvas/Offcanvas.js',
        Paginator: './Components/Paginator/Paginator.js',
        PieChart: './Components/PieChart/PieChart.js',
        Popup: './Components/Popup/Popup.js',
        Progress: './Components/Progress/Progress.js',
        Radio: './Components/Radio/Radio.js',
        Slider: './Components/Slider/Slider.js',
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
