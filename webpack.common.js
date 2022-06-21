import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import HtmlWebpackPlugin from 'html-webpack-plugin';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const htmlMinifyOptions = {
    removeRedundantAttributes: false
};

export default {
    target: 'browserslist',
    entry: {
        index: './src/js/index.js',

        polyfills: './src/js/polyfill/index.js',
        Collapsible: './src/Components/Collapsible/Collapsible.js',
        DateInput: './src/Components/DateInput/DateInput.js',
        DecimalInput: './src/Components/DecimalInput/DecimalInput.js',
        DropDown: './src/Components/DropDown/DropDown.js',
        DatePicker: './src/Components/DatePicker/DatePicker.js',
        DragnDrop: './src/Components/DragnDrop',
        Sortable: './src/Components/Sortable',
        Histogram: './src/Components/Charts/Histogram.js',
        LineChart: './src/Components/Charts/LineChart.js',
        Paginator: './src/Components/Paginator/Paginator.js',
        PieChart: './src/Components/PieChart/PieChart.js',
        Popup: './src/Components/Popup/Popup.js',
        Progress: './src/Components/Progress/Progress.js',
        Slider: './src/Components/Slider/Slider.js',

        demoMain: {
            import: './src/demo/js/main.js',
            filename: 'demo/js/[name].js',
        },
        chartGridDemo: {
            import: './src/demo/js/ChartGrid.js',
            filename: 'demo/js/[name].js',
        },
        chartsDemo: {
            import: './src/demo/js/Charts.js',
            filename: 'demo/js/[name].js',
        },
        commonTestsDemo: {
            import: './src/demo/js/CommonTests.js',
            filename: 'demo/js/[name].js',
        },
        collapsibleDemo: {
            import: './src/demo/js/Collapsible.js',
            filename: 'demo/js/[name].js',
            dependOn: ['Collapsible']
        },
        dateInputDemo: {
            import: './src/demo/js/DateInput.js',
            filename: 'demo/js/[name].js',
            dependOn: 'DateInput'
        },
        datePickerDemo: {
            import: './src/demo/js/DatePicker.js',
            filename: 'demo/js/[name].js',
            dependOn: 'DatePicker'
        },
        debugDemo: {
            import: './src/demo/js/Debug.js',
            filename: 'demo/js/[name].js',
        },
        decimalInputDemo: {
            import: './src/demo/js/DecimalInput.js',
            filename: 'demo/js/[name].js',
            dependOn: 'DecimalInput'
        },
        dpiTestDemo: {
            import: './src/demo/js/DpiTest.js',
            filename: 'demo/js/[name].js'
        },
        dragnDropDemo: {
            import: './src/demo/js/DragnDrop.js',
            filename: 'demo/js/[name].js',
            dependOn: ['DragnDrop', 'Sortable']
        },
        dropDownDemo: {
            import: './src/demo/js/DropDown.js',
            filename: 'demo/js/[name].js',
            dependOn: 'DropDown'
        },
        emptyClickDemo: {
            import: './src/demo/js/EmptyClick.js',
            filename: 'demo/js/[name].js',
        },
        paginatorDemo: {
            import: './src/demo/js/Paginator.js',
            filename: 'demo/js/[name].js',
            dependOn: 'Paginator'
        },
        pieChartDemo: {
            import: './src/demo/js/PieChart.js',
            filename: 'demo/js/[name].js',
            dependOn: 'PieChart'
        },
        popupDemo: {
            import: './src/demo/js/Popup.js',
            filename: 'demo/js/[name].js',
            dependOn: ['Popup', 'DragnDrop']
        },
        progressDemo: {
            import: './src/demo/js/Progress.js',
            filename: 'demo/js/[name].js',
            dependOn: 'Progress'
        },
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
                test: /\.css$/i,
                use: ['style-loader', 'css-loader', 'postcss-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/index.html',
            filename: 'demo/index.html',
            chunks: ['polyfills', 'demoMain'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/chartgrid.html',
            filename: 'demo/chartgrid.html',
            chunks: ['polyfills', 'chartGridDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/charts.html',
            filename: 'demo/charts.html',
            chunks: ['polyfills', 'chartsDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/common.html',
            filename: 'demo/common.html',
            chunks: ['polyfills', 'commonTestsDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/collapsible.html',
            filename: 'demo/collapsible.html',
            chunks: ['polyfills', 'Collapsible', 'collapsibleDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/dateinput.html',
            filename: 'demo/dateinput.html',
            chunks: ['polyfills', 'DateInput', 'dateInputDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/datepicker.html',
            filename: 'demo/datepicker.html',
            chunks: ['polyfills', 'DatePicker', 'datePickerDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/debug.html',
            filename: 'demo/debug.html',
            chunks: ['polyfills', 'debugDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/decimal.html',
            filename: 'demo/decimal.html',
            chunks: ['polyfills', 'DecimalInput', 'decimalInputDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/dpitest.html',
            filename: 'demo/dpitest.html',
            chunks: ['polyfills', 'dpiTestDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/dragndrop.html',
            filename: 'demo/dragndrop.html',
            chunks: ['polyfills', 'DragnDrop', 'Sortable', 'dragnDropDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/dropdown.html',
            filename: 'demo/dropdown.html',
            chunks: ['polyfills', 'DropDown', 'dropDownDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/emptyclick.html',
            filename: 'demo/emptyclick.html',
            chunks: ['polyfills', 'emptyClickDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/paginator.html',
            filename: 'demo/paginator.html',
            chunks: ['polyfills', 'Paginator', 'paginatorDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/piechart.html',
            filename: 'demo/piechart.html',
            chunks: ['polyfills', 'PieChart', 'pieChartDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/popup.html',
            filename: 'demo/popup.html',
            chunks: ['polyfills', 'Popup', 'DragnDrop', 'popupDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/templates/progress.html',
            filename: 'demo/progress.html',
            chunks: ['polyfills', 'Progress', 'progressDemo'],
            minify: htmlMinifyOptions,
        }),
    ],
};
