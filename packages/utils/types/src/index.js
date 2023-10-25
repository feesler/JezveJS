/** Checks if a parameter is Date */
export const isDate = (obj) => (
    obj instanceof Date && !Number.isNaN(obj.valueOf())
);

/** Checks if a parameter is function */
export const isFunction = (obj) => (
    obj
    && (
        Object.prototype.toString.call(obj) === '[object Function]'
        || typeof obj === 'function'
    )
);

/** Checks if a parameter is instance of Object */
export const isObject = (obj) => (
    obj !== null
    && typeof obj === 'object'
    && Object.prototype.toString.call(obj) === '[object Object]'
);

/** Checks if a parameter is Number or valid number string */
export const isNumber = (val) => {
    const fval = parseFloat(val);
    if (Number.isNaN(fval)) {
        return false;
    }

    if (fval === 0) {
        return true;
    }

    return !!(val / val);
};

/** Checks if a parameter is integer Number or valid integer string */
export const isInteger = (x) => {
    const y = parseInt(x, 10);
    if (Number.isNaN(y)) {
        return false;
    }

    return x === y && x.toString() === y.toString();
};

/** Checks if a parameter is array */
export const isArray = (obj) => Array.isArray(obj);

/** Returns parameter if it is array, else wrap value to array */
export const asArray = (value) => {
    if (value === null || value === undefined) {
        return [];
    }

    return Array.isArray(value) ? value : [value];
};
