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

export default {
    target: 'browserslist',
    context: resolve(currentDir, '../demo/src'),
    entry: {
        polyfills: '../../packages/jezvejs/src/js/polyfill/index.js',

        demoMain: './Views/Main/Main.js',
        chartGridDemo: './Views/ChartGrid/ChartGrid.js',
        checkboxDemo: './Views/Checkbox/Checkbox.js',
        commonTestsDemo: './Views/CommonTests/CommonTests.js',
        collapsibleDemo: './Views/Collapsible/Collapsible.js',
        dateInputDemo: './Views/DateInput/DateInput.js',
        datePickerDemo: './Views/DatePicker/DatePicker.js',
        debugDemo: './Views/Debug/Debug.js',
        decimalInputDemo: './Views/DecimalInput/DecimalInput.js',
        dpiTestDemo: './Views/DpiTest/DpiTest.js',
        dragnDropDemo: './Views/DragnDrop/DragnDrop.js',
        dropDownDemo: './Views/DropDown/DropDown.js',
        emptyClickDemo: './Views/EmptyClick/EmptyClick.js',
        histogramDemo: './Views/Histogram/Histogram.js',
        linkMenuDemo: './Views/LinkMenu/LinkMenu.js',
        iconButtonDemo: './Views/IconButton/IconButton.js',
        inputGroupDemo: './Views/InputGroup/InputGroup.js',
        linechartDemo: './Views/LineChart/LineChart.js',
        offcanvasDemo: './Views/Offcanvas/Offcanvas.js',
        paginatorDemo: './Views/Paginator/Paginator.js',
        pieChartDemo: './Views/PieChart/PieChart.js',
        popupDemo: './Views/Popup/Popup.js',
        popupMenuDemo: './Views/PopupMenu/PopupMenu.js',
        progressDemo: './Views/Progress/Progress.js',
        sliderDemo: './Views/Slider/Slider.js',
        switchDemo: './Views/Switch/Switch.js',
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
        new HtmlWebpackPlugin({
            template: './Views/Main/index.html',
            filename: 'demo/index.html',
            chunks: ['polyfills', 'demoMain'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/ChartGrid/chartgrid.html',
            filename: 'demo/chartgrid.html',
            chunks: ['polyfills', 'chartGridDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/Checkbox/checkbox.html',
            filename: 'demo/checkbox.html',
            chunks: ['polyfills', 'checkboxDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/CommonTests/common.html',
            filename: 'demo/common.html',
            chunks: ['polyfills', 'commonTestsDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/Collapsible/collapsible.html',
            filename: 'demo/collapsible.html',
            chunks: ['polyfills', 'collapsibleDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/DateInput/dateinput.html',
            filename: 'demo/dateinput.html',
            chunks: ['polyfills', 'dateInputDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/DatePicker/datepicker.html',
            filename: 'demo/datepicker.html',
            chunks: ['polyfills', 'datePickerDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/Debug/debug.html',
            filename: 'demo/debug.html',
            chunks: ['polyfills', 'debugDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/DecimalInput/decimal.html',
            filename: 'demo/decimal.html',
            chunks: ['polyfills', 'decimalInputDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/DpiTest/dpitest.html',
            filename: 'demo/dpitest.html',
            chunks: ['polyfills', 'dpiTestDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/DragnDrop/dragndrop.html',
            filename: 'demo/dragndrop.html',
            chunks: ['polyfills', 'dragnDropDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/DropDown/dropdown.html',
            filename: 'demo/dropdown.html',
            chunks: ['polyfills', 'dropDownDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/EmptyClick/emptyclick.html',
            filename: 'demo/emptyclick.html',
            chunks: ['polyfills', 'emptyClickDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/Histogram/histogram.html',
            filename: 'demo/histogram.html',
            chunks: ['polyfills', 'histogramDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/LinkMenu/linkmenu.html',
            filename: 'demo/linkmenu.html',
            chunks: ['polyfills', 'linkMenuDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/IconButton/iconbutton.html',
            filename: 'demo/iconbutton.html',
            chunks: ['polyfills', 'iconButtonDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/InputGroup/inputgroup.html',
            filename: 'demo/inputgroup.html',
            chunks: ['polyfills', 'inputGroupDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/LineChart/linechart.html',
            filename: 'demo/linechart.html',
            chunks: ['polyfills', 'linechartDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/Offcanvas/offcanvas.html',
            filename: 'demo/offcanvas.html',
            chunks: ['polyfills', 'offcanvasDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/Paginator/paginator.html',
            filename: 'demo/paginator.html',
            chunks: ['polyfills', 'paginatorDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/PieChart/piechart.html',
            filename: 'demo/piechart.html',
            chunks: ['polyfills', 'pieChartDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/Popup/popup.html',
            filename: 'demo/popup.html',
            chunks: ['polyfills', 'popupDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/PopupMenu/popupmenu.html',
            filename: 'demo/popupmenu.html',
            chunks: ['polyfills', 'popupMenuDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/Progress/progress.html',
            filename: 'demo/progress.html',
            chunks: ['polyfills', 'progressDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/Slider/Slider.html',
            filename: 'demo/slider.html',
            chunks: ['polyfills', 'sliderDemo'],
            ...htmlCommonOptions,
        }),
        new HtmlWebpackPlugin({
            template: './Views/Switch/switch.html',
            filename: 'demo/switch.html',
            chunks: ['polyfills', 'switchDemo'],
            ...htmlCommonOptions,
        }),
    ],
    cache: {
        type: 'filesystem',
    },
};
