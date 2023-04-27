import { isObject } from 'jezve-test';

/** Format specified value */
export function formatValue(val) {
    return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
}

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
