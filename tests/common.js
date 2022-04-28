import {
    isFunction,
    isDate,
    isNum,
    isObject,
} from 'jezve-test';

export async function asyncMap(data, func) {
    if (!Array.isArray(data)) {
        throw new Error('Invalid data type');
    }
    if (!isFunction(func)) {
        throw new Error('Invalid function type');
    }

    const tasks = data.map(func);
    return Promise.all(tasks);
}

/** Convert date string from DD.MM.YYYY to timestamp */
export function convDate(dateStr) {
    if (typeof dateStr !== 'string') {
        return null;
    }

    const res = Date.parse(dateStr.split('.').reverse().join('-'));
    if (Number.isNaN(res)) {
        return null;
    }

    return res;
}

/** Return timestamp for the start of the day */
export function cutDate(date) {
    if (!isDate(date)) {
        return null;
    }

    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

// Convert Date object, timestamp or DD.MM.YYYY string to the timestamp of the start of day
export function fixDate(date) {
    if (isDate(date)) {
        return cutDate(date);
    }

    if (typeof date === 'number') {
        return cutDate(new Date(date));
    }

    return convDate(date);
}

/** Check string is correct date in dd.mm.yyyy format */
export function checkDate(str) {
    if (typeof str !== 'string' || !str.length) {
        return false;
    }

    const sparr = str.split('.');
    if (sparr.length !== 3) {
        return false;
    }

    if (!isNum(sparr[0]) || !isNum(sparr[1]) || !isNum(sparr[2])) {
        return false;
    }

    if (
        sparr[0] < 1
        || sparr[0] > 31
        || sparr[1] < 1
        || sparr[1] > 12
        || sparr[2] < 1970
    ) {
        return false;
    }

    return true;
}

/** Format specified value */
export function formatValue(val) {
    return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
}

/*
* Other
*/

/** Join parameters and values of object to URL */
export function urlJoin(obj) {
    if (!isObject(obj)) {
        return '';
    }

    const arr = [];
    Object.keys(obj).forEach((par) => {
        const val = obj[par];

        if (typeof val === 'undefined') {
            return;
        }

        if (Array.isArray(val)) {
            val.forEach((arrItem) => {
                if (!isObject(arrItem)) {
                    const parName = encodeURIComponent(par);
                    const parValue = encodeURIComponent(arrItem.toString());
                    arr.push(`${parName}[]=${parValue}`);
                }
            });
        } else if (!isObject(val)) {
            const parName = encodeURIComponent(par);
            const parValue = encodeURIComponent(val.toString());
            arr.push(`${parName}=${parValue}`);
        }
    });

    return arr.join('&');
}

export function formatProps(params) {
    const res = Object.keys(params).map((key) => `${key}: ${params[key]}`);

    return res.join(', ');
}

export function checkPHPerrors(content) {
    const errSignatures = [
        '<b>Notice</b>',
        '<b>Parse error</b>',
        '<b>Fatal error</b>',
        'xdebug-error',
    ];

    if (!content) {
        return;
    }

    const found = errSignatures.some((item) => content.includes(item));
    if (found) {
        throw new Error('PHP error signature found');
    }
}
