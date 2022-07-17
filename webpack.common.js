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
        Checkbox: './src/Components/Checkbox/Checkbox.js',
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
        Radio: './src/Components/Radio/Radio.js',
        Slider: './src/Components/Slider/Slider.js',
        Switch: './src/Components/Switch/Switch.js',

        demoMain: {
            import: './src/demo/main/main.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        chartGridDemo: {
            import: './src/demo/ChartGrid/ChartGrid.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        chartsDemo: {
            import: './src/demo/Charts/Charts.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        checkboxDemo: {
            import: './src/demo/Checkbox/Checkbox.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        commonTestsDemo: {
            import: './src/demo/CommonTests/CommonTests.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        collapsibleDemo: {
            import: './src/demo/Collapsible/Collapsible.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        dateInputDemo: {
            import: './src/demo/DateInput/DateInput.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        datePickerDemo: {
            import: './src/demo/DatePicker/DatePicker.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        debugDemo: {
            import: './src/demo/Debug/Debug.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        decimalInputDemo: {
            import: './src/demo/DecimalInput/DecimalInput.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        dpiTestDemo: {
            import: './src/demo/DpiTest/DpiTest.js',
            filename: 'demo/js/[name].js'
        },
        dragnDropDemo: {
            import: './src/demo/DragnDrop/DragnDrop.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        dropDownDemo: {
            import: './src/demo/DropDown/DropDown.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        emptyClickDemo: {
            import: './src/demo/EmptyClick/EmptyClick.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        paginatorDemo: {
            import: './src/demo/Paginator/Paginator.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        pieChartDemo: {
            import: './src/demo/PieChart/PieChart.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        popupDemo: {
            import: './src/demo/Popup/Popup.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        progressDemo: {
            import: './src/demo/Progress/Progress.js',
            filename: 'demo/js/[name].[fullhash].js',
        },
        switchDemo: {
            import: './src/demo/Switch/Switch.js',
            filename: 'demo/js/[name].[fullhash].js',
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
            template: 'src/demo/main/index.html',
            filename: 'demo/index.html',
            chunks: ['polyfills', 'demoMain'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/ChartGrid/chartgrid.html',
            filename: 'demo/chartgrid.html',
            chunks: ['polyfills', 'chartGridDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/Charts/charts.html',
            filename: 'demo/charts.html',
            chunks: ['polyfills', 'chartsDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/Checkbox/checkbox.html',
            filename: 'demo/checkbox.html',
            chunks: ['polyfills', 'checkboxDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/CommonTests/common.html',
            filename: 'demo/common.html',
            chunks: ['polyfills', 'commonTestsDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/Collapsible/collapsible.html',
            filename: 'demo/collapsible.html',
            chunks: ['polyfills', 'collapsibleDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/DateInput/dateinput.html',
            filename: 'demo/dateinput.html',
            chunks: ['polyfills', 'dateInputDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/DatePicker/datepicker.html',
            filename: 'demo/datepicker.html',
            chunks: ['polyfills', 'datePickerDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/Debug/debug.html',
            filename: 'demo/debug.html',
            chunks: ['polyfills', 'debugDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/DecimalInput/decimal.html',
            filename: 'demo/decimal.html',
            chunks: ['polyfills', 'decimalInputDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/DpiTest/dpitest.html',
            filename: 'demo/dpitest.html',
            chunks: ['polyfills', 'dpiTestDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/DragnDrop/dragndrop.html',
            filename: 'demo/dragndrop.html',
            chunks: ['polyfills', 'dragnDropDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/DropDown/dropdown.html',
            filename: 'demo/dropdown.html',
            chunks: ['polyfills', 'dropDownDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/EmptyClick/emptyclick.html',
            filename: 'demo/emptyclick.html',
            chunks: ['polyfills', 'emptyClickDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/Paginator/paginator.html',
            filename: 'demo/paginator.html',
            chunks: ['polyfills', 'paginatorDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/PieChart/piechart.html',
            filename: 'demo/piechart.html',
            chunks: ['polyfills', 'pieChartDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/Popup/popup.html',
            filename: 'demo/popup.html',
            chunks: ['polyfills', 'popupDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/Progress/progress.html',
            filename: 'demo/progress.html',
            chunks: ['polyfills', 'progressDemo'],
            minify: htmlMinifyOptions,
        }),
        new HtmlWebpackPlugin({
            template: 'src/demo/Switch/switch.html',
            filename: 'demo/switch.html',
            chunks: ['polyfills', 'switchDemo'],
            minify: htmlMinifyOptions,
        }),
    ],
};
