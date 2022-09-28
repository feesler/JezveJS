import { MainView } from './view/main.js';
import { DropDownView } from './view/DropDown.js';
import { DatePickerView } from './view/DatePicker.js';
import { PaginatorView } from './view/Paginator.js';

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
        reqPath = reqPath.substr(testUrl.pathname.length);
    }

    const path = reqPath.replace(/^\/+|\/+$/g, ''); // cut leading and trailing slashes
    const parts = path.split('/');
    let part = parts.shift();
    if (part === 'jezvejs') {
        part = parts.shift();
    }
    if (part === 'demo') {
        part = parts.shift();
    }

    if (!part) {
        return MainView;
    }

    const dotInd = part.indexOf('.');
    if (dotInd !== -1) {
        part = part.substring(0, dotInd);
    }

    if (part === 'dropdown') {
        return DropDownView;
    }
    if (part === 'datepicker') {
        return DatePickerView;
    }
    if (part === 'paginator') {
        return PaginatorView;
    }

    throw new Error(`Unknown route: ${reqUrl.pathname}`);
}
