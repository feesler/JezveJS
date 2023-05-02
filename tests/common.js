/** Format specified value */
export function formatValue(val) {
    return val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
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
