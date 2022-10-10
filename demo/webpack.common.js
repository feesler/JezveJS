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
        polyfills: {
            import: '../src/js/polyfill/index.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        demoMain: {
            import: './src/main/main.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        chartGridDemo: {
            import: './src/ChartGrid/ChartGrid.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        checkboxDemo: {
            import: './src/Checkbox/Checkbox.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        commonTestsDemo: {
            import: './src/CommonTests/CommonTests.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        collapsibleDemo: {
            import: './src/Collapsible/Collapsible.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        dateInputDemo: {
            import: './src/DateInput/DateInput.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        datePickerDemo: {
            import: './src/DatePicker/DatePicker.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        debugDemo: {
            import: './src/Debug/Debug.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        decimalInputDemo: {
            import: './src/DecimalInput/DecimalInput.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        dpiTestDemo: {
            import: './src/DpiTest/DpiTest.js',
            filename: 'demo/js/[name].[fullhash].js'
        },
        dragnDropDemo: {
            import: './src/DragnDrop/DragnDrop.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        dropDownDemo: {
            import: './src/DropDown/DropDown.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        emptyClickDemo: {
            import: './src/EmptyClick/EmptyClick.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        histogramDemo: {
            import: './src/Histogram/Histogram.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        inputGroupDemo: {
            import: './src/InputGroup/InputGroup.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        linechartDemo: {
            import: './src/LineChart/LineChart.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        offcanvasDemo: {
            import: './src/Offcanvas/Offcanvas.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        paginatorDemo: {
            import: './src/Paginator/Paginator.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        pieChartDemo: {
            import: './src/PieChart/PieChart.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        popupDemo: {
            import: './src/Popup/Popup.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        progressDemo: {
            import: './src/Progress/Progress.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        sliderDemo: {
            import: './src/Slider/Slider.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        switchDemo: {
            import: './src/Switch/Switch.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
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
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/main/index.html',
            filename: 'demo/index.html',
            chunks: ['polyfills', 'demoMain'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/ChartGrid/chartgrid.html',
            filename: 'demo/chartgrid.html',
            chunks: ['polyfills', 'chartGridDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/Checkbox/checkbox.html',
            filename: 'demo/checkbox.html',
            chunks: ['polyfills', 'checkboxDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/CommonTests/common.html',
            filename: 'demo/common.html',
            chunks: ['polyfills', 'commonTestsDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/Collapsible/collapsible.html',
            filename: 'demo/collapsible.html',
            chunks: ['polyfills', 'collapsibleDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/DateInput/dateinput.html',
            filename: 'demo/dateinput.html',
            chunks: ['polyfills', 'dateInputDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/DatePicker/datepicker.html',
            filename: 'demo/datepicker.html',
            chunks: ['polyfills', 'datePickerDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/Debug/debug.html',
            filename: 'demo/debug.html',
            chunks: ['polyfills', 'debugDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/DecimalInput/decimal.html',
            filename: 'demo/decimal.html',
            chunks: ['polyfills', 'decimalInputDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/DpiTest/dpitest.html',
            filename: 'demo/dpitest.html',
            chunks: ['polyfills', 'dpiTestDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/DragnDrop/dragndrop.html',
            filename: 'demo/dragndrop.html',
            chunks: ['polyfills', 'dragnDropDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/DropDown/dropdown.html',
            filename: 'demo/dropdown.html',
            chunks: ['polyfills', 'dropDownDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/EmptyClick/emptyclick.html',
            filename: 'demo/emptyclick.html',
            chunks: ['polyfills', 'emptyClickDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/Histogram/histogram.html',
            filename: 'demo/histogram.html',
            chunks: ['polyfills', 'histogramDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/InputGroup/inputgroup.html',
            filename: 'demo/inputgroup.html',
            chunks: ['polyfills', 'inputGroupDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/LineChart/linechart.html',
            filename: 'demo/linechart.html',
            chunks: ['polyfills', 'linechartDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/Offcanvas/offcanvas.html',
            filename: 'demo/offcanvas.html',
            chunks: ['polyfills', 'offcanvasDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/Paginator/paginator.html',
            filename: 'demo/paginator.html',
            chunks: ['polyfills', 'paginatorDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/PieChart/piechart.html',
            filename: 'demo/piechart.html',
            chunks: ['polyfills', 'pieChartDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/Popup/popup.html',
            filename: 'demo/popup.html',
            chunks: ['polyfills', 'popupDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/Progress/progress.html',
            filename: 'demo/progress.html',
            chunks: ['polyfills', 'progressDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/Slider/Slider.html',
            filename: 'demo/slider.html',
            chunks: ['polyfills', 'sliderDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/Switch/switch.html',
            filename: 'demo/switch.html',
            chunks: ['polyfills', 'switchDemo'],
            minify: htmlMinifyOptions,
        }),
    ],
    cache: {
        type: 'filesystem',
    },
};
