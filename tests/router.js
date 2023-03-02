import { AppView } from './view/AppView.js';
import { CollapsibleView } from './view/CollapsibleView.js';
import { DropDownView } from './view/DropDownView.js';
import { DatePickerView } from './view/DatePickerView.js';
import { PaginatorView } from './view/PaginatorView.js';
import { TabListView } from './view/TabListView.js';

const routeMap = {
    dropdown: DropDownView,
    datepicker: DatePickerView,
    paginator: PaginatorView,
    chartgrid: AppView,
    checkbox: AppView,
    collapsible: CollapsibleView,
    common: AppView,
    dateinput: AppView,
    debug: AppView,
    decimal: AppView,
    dpitest: AppView,
    dragndrop: AppView,
    emptyclick: AppView,
    histogram: AppView,
    button: AppView,
    index: AppView,
    inputgroup: AppView,
    linechart: AppView,
    linkmenu: AppView,
    offcanvas: AppView,
    piechart: AppView,
    popup: AppView,
    popupmenu: AppView,
    progress: AppView,
    slider: AppView,
    switch: AppView,
    tablist: TabListView,
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

    const path = reqPath.replace(/^\/+|\/+$/g, ''); // cut leading and trailing slashes
    const parts = path.split('/');
    let part = parts.shift().toLowerCase();
    if (part === 'jezvejs') {
        part = parts.shift().toLowerCase();
    }
    if (part === 'demo') {
        part = parts.shift().toLowerCase();
    }

    if (!part) {
        return routeMap.index;
    }

    const dotInd = part.indexOf('.');
    if (dotInd !== -1) {
        part = part.substring(0, dotInd);
    }

    if (!routeMap[part]) {
        throw new Error(`Unknown route: ${reqUrl.pathname}`);
    }

    return routeMap[part];
}
