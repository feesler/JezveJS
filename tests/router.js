import { AppView } from './view/AppView.js';
import { CollapsibleView } from './view/CollapsibleView.js';
import { DecimalInputView } from './view/DecimalInputView.js';
import { DateInputView } from './view/DateInputView.js';
import { DropDownView } from './view/DropDownView.js';
import { DatePickerView } from './view/DatePickerView.js';
import { PaginatorView } from './view/PaginatorView.js';
import { PopupMenuView } from './view/PopupMenuView.js';
import { TabListView } from './view/TabListView.js';

const routeMap = {
    dropdown: DropDownView,
    datepicker: DatePickerView,
    paginator: PaginatorView,
    chartgrid: AppView,
    checkbox: AppView,
    collapsible: CollapsibleView,
    colorutils: AppView,
    common: AppView,
    dateinput: DateInputView,
    debug: AppView,
    decimalinput: DecimalInputView,
    dpitest: AppView,
    dragndrop: AppView,
    emptyclick: AppView,
    header: AppView,
    histogram: AppView,
    button: AppView,
    index: AppView,
    inputgroup: AppView,
    linechart: AppView,
    linkmenu: AppView,
    menu: AppView,
    offcanvas: AppView,
    piechart: AppView,
    popup: AppView,
    popupmenu: PopupMenuView,
    progress: AppView,
    rangescrollchart: AppView,
    rangeslider: AppView,
    slider: AppView,
    switch: AppView,
    tablist: TabListView,
    tags: AppView,
    weekdayselect: AppView,
};

/** Process request url and return view class if match */
export async function route(env, url) {
    if (typeof url !== 'string') {
        throw new Error('URL not specified');
    }

    const testUrl = new URL(env.baseUrl());

    const reqUrl = new URL(url);
    if (reqUrl.host !== testUrl.host) {
        throw new Error(`Invalid URL specified: ${url}`);
    }

    // Remove leading directory if needed
    let reqPath = reqUrl.pathname;
    if (reqPath.startsWith(testUrl.pathname)) {
        reqPath = reqPath.substring(testUrl.pathname.length);
    }

    // cut leading and trailing slashes
    const path = reqPath.replace(/^\/+|\/+$/g, '');
    const parts = path.split('/');
    let part = parts.shift()?.toLowerCase();

    if (part === 'jezvejs') {
        part = parts.shift()?.toLowerCase();
    }

    if (typeof part !== 'string' || part.length === 0) {
        return routeMap.index;
    }

    const dotInd = part.lastIndexOf('.');
    if (dotInd !== -1) {
        part = part.substring(0, dotInd);
    }

    if (!routeMap[part]) {
        throw new Error(`Unknown route: ${reqUrl.pathname}`);
    }

    return routeMap[part];
}
