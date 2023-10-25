import { isDate, isFunction } from '@jezvejs/types';

export const MONTH_VIEW = 'month';
export const YEAR_VIEW = 'year';
export const YEARRANGE_VIEW = 'yearrange';

export const YEAR_RANGE_LENGTH = 10;

export const toCSSValue = (val) => (+val.toFixed(4));

/** Compares order of view types and returns result */
export const compareViewTypes = (a, b) => {
    const typeMap = {
        [MONTH_VIEW]: 1,
        [YEAR_VIEW]: 2,
        [YEARRANGE_VIEW]: 3,
    };

    if (!(a in typeMap) || !(b in typeMap)) {
        throw new Error('Invalid view type');
    }

    return typeMap[a] - typeMap[b];
};

/** Returns previous date for specified view type */
export const getPrevViewDate = (date, viewType) => {
    if (!isDate(date)) {
        throw new Error('Invalid date');
    }

    const typeMap = {
        [MONTH_VIEW]: (d) => (new Date(d.getFullYear(), d.getMonth() - 1, 1)),
        [YEAR_VIEW]: (d) => (new Date(d.getFullYear() - 1, 1, 1)),
        [YEARRANGE_VIEW]: (d) => (new Date(d.getFullYear() - YEAR_RANGE_LENGTH, 1, 1)),
    };

    if (!isFunction(typeMap[viewType])) {
        throw new Error('Invalid view type');
    }

    return typeMap[viewType](date);
};

/** Returns next date for specified view type */
export const getNextViewDate = (date, viewType) => {
    if (!isDate(date)) {
        throw new Error('Invalid date');
    }

    const typeMap = {
        [MONTH_VIEW]: (d) => (new Date(d.getFullYear(), d.getMonth() + 1, 1)),
        [YEAR_VIEW]: (d) => (new Date(d.getFullYear() + 1, 1, 1)),
        [YEARRANGE_VIEW]: (d) => (new Date(d.getFullYear() + YEAR_RANGE_LENGTH, 1, 1)),
    };

    if (!isFunction(typeMap[viewType])) {
        throw new Error('Invalid view type');
    }

    return typeMap[viewType](date);
};
