import { getLongMonthName, isSameDate } from '@jezvejs/datetime';
import { asArray, isDate, isFunction } from '@jezvejs/types';

export const MONTH_VIEW = 'month';
export const YEAR_VIEW = 'year';
export const YEARRANGE_VIEW = 'yearrange';

export const YEAR_RANGE_LENGTH = 10;

export const toCSSValue = (val) => (+val.toFixed(4));

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

/** Returns true if array includes Date object for same date as specified */
export const includesDate = (arr, date) => (
    asArray(arr).some((item) => isSameDate(item, date))
);

/** Returns width of screen considering orientation */
export const getScreenWidth = () => {
    const { angle } = window.screen.orientation;
    const { width, height } = window.screen;
    return (angle === 270 || angle === 90)
        ? Math.max(width, height)
        : Math.min(width, height);
};

/** Returns header title string for specified view state */
export const getHeaderTitle = (state) => {
    const { viewType, date, locales } = state;
    const rYear = date.getFullYear();

    if (viewType === MONTH_VIEW) {
        const monthLong = getLongMonthName(date, locales);
        return `${monthLong} ${rYear}`;
    }

    if (viewType === YEAR_VIEW) {
        return rYear;
    }

    if (viewType === YEARRANGE_VIEW) {
        const startYear = rYear - (rYear % 10) - 1;
        return `${startYear + 1}-${startYear + YEAR_RANGE_LENGTH}`;
    }

    throw new Error('Invalid view type');
};

/** Returns offsetHeight for specified component */
export const getComponentHeight = (component) => (
    component?.elem?.offsetHeight ?? 0
);
