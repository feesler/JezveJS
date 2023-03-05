import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const currentDir = dirname(filename);

export default {
    target: 'browserslist',
    context: resolve(currentDir, '../packages/jezvejs/'),
    entry: {
        index: './index.js',
        polyfills: './src/js/polyfill/index.js',
        BaseChart: './src/Components/BaseChart/BaseChart.js',
        Button: './src/Components/Button/Button.js',
        ChartGrid: './src/Components/ChartGrid/ChartGrid.js',
        Checkbox: './src/Components/Checkbox/Checkbox.js',
        CloseButton: './src/Components/CloseButton/CloseButton.js',
        Collapsible: './src/Components/Collapsible/Collapsible.js',
        DateInput: './src/Components/DateInput/DateInput.js',
        DatePicker: './src/Components/DatePicker/DatePicker.js',
        Debug: './src/Components/Debug/Debug.js',
        DecimalInput: './src/Components/DecimalInput/DecimalInput.js',
        DragnDrop: './src/Components/DragnDrop/DragnDrop.js',
        DropDown: './src/Components/DropDown/DropDown.js',
        Histogram: './src/Components/Histogram/Histogram.js',
        Icon: './src/Components/Icon/Icon.js',
        IndetermProgress: './src/Components/IndetermProgress/IndetermProgress.js',
        Input: './src/Components/Input/Input.js',
        InputGroup: './src/Components/InputGroup/InputGroup.js',
        LineChart: './src/Components/LineChart/LineChart.js',
        LinkMenu: './src/Components/LinkMenu/LinkMenu.js',
        ListContainer: './src/Components/ListContainer/ListContainer.js',
        MenuButton: './src/Components/MenuButton/MenuButton.js',
        Notification: './src/Components/Notification/Notification.js',
        Offcanvas: './src/Components/Offcanvas/Offcanvas.js',
        Paginator: './src/Components/Paginator/Paginator.js',
        PieChart: './src/Components/PieChart/PieChart.js',
        Popup: './src/Components/Popup/Popup.js',
        PopupMenu: './src/Components/PopupMenu/PopupMenu.js',
        PopupPosition: './src/Components/PopupPosition/PopupPosition.js',
        Progress: './src/Components/Progress/Progress.js',
        Radio: './src/Components/Radio/Radio.js',
        Slidable: './src/Components/Slidable/Slidable.js',
        Slider: './src/Components/Slider/Slider.js',
        Sortable: './src/Components/Sortable/Sortable.js',
        SortableListContainer: './src/Components/SortableListContainer/SortableListContainer.js',
        Spinner: './src/Components/Spinner/Spinner.js',
        Switch: './src/Components/Switch/Switch.js',
        TabList: './src/Components/TabList/TabList.js',
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
