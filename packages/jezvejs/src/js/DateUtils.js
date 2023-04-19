import { isDate } from './common.js';

export const DAYS_IN_WEEK = 7;
export const MONTHS_COUNT = 12;

function firstUpperCase(str, locales = []) {
    const first = str.substring(0, 1);
    const rest = str.substring(1);

    return first.toLocaleUpperCase(locales)
        .concat(rest.toLocaleLowerCase(locales));
}

/** Returns fixed date locale string without RTL characters */
export const formatDate = (date, locales = [], options = {}) => (
    date.toLocaleDateString(locales, options).replace(/\u200e/g, '')
);

/** Returns object with positions of date parts and separator */
export const getLocaleDateFormat = (locales = [], options = {}) => {
    const formatter = Intl.DateTimeFormat(locales, options);
    const parts = formatter.formatToParts();

    const res = {
        dayIndex: -1,
        monthIndex: -1,
        yearIndex: -1,
        yearLength: 0,
        separator: null,
    };

    let index = 0;
    parts.forEach((part) => {
        if (part.type === 'day') {
            res.dayIndex = index;
            index += 1;
        }
        if (part.type === 'month') {
            res.monthIndex = index;
            index += 1;
        }
        if (part.type === 'year') {
            res.yearIndex = index;
            res.yearLength = part.value.length;
            index += 1;
        }
        if (part.type === 'literal') {
            res.separator = part.value;
        }
    });

    return res;
};

/** Returns date parsed from string accodring to specified locale */
export const parseDateString = (str, locales = [], options = {}) => {
    if (typeof str !== 'string' || str.length === 0) {
        return NaN;
    }

    const format = getLocaleDateFormat(locales, options);
    if (
        !format
        || format.dayIndex === -1
        || format.monthIndex === -1
        || format.yearIndex === -1
        || !format.separator
    ) {
        return NaN;
    }

    const dateParts = str.split(format.separator);
    const day = parseInt(dateParts[format.dayIndex], 10);
    const month = parseInt(dateParts[format.monthIndex], 10);
    let year = parseInt(dateParts[format.yearIndex], 10);

    if (format.yearLength === 2 && year < 100) {
        year += (year >= 70) ? 1900 : 2000;
    }

    if (
        !(day >= 1 && day <= 31)
        || !(month >= 1 && month <= 12)
        || !(year >= 1970)
    ) {
        return NaN;
    }

    return new Date(Date.UTC(year, month - 1, day));
};

/** Returns true if specified argument is valid date string for current locale */
export const isValidDateString = (str, locales = [], options = {}) => {
    const date = parseDateString(str, locales, options);
    return isDate(date);
};

/** Shift date to specified count of days */
export const shiftDate = (date, shift) => (
    new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate() + shift,
    ))
);

/**
 * Return count of days in month of the specified date
 */
export const getDaysInMonth = (date) => {
    const monthDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return monthDate.getDate();
};

/**
 * Return monday based(0 - monday, 6 - sunday) day of week of specified date
 */
export const getMondayBasedDayOfWeek = (date) => {
    const day = date.getDay();
    return (day || DAYS_IN_WEEK) - 1;
};

/**
 * Return monday on week of the specified date
 */
export const getFirstDayOfWeek = (date) => {
    const day = getMondayBasedDayOfWeek(date);
    return shiftDate(date, -day);
};

/**
 * Returns array of days for week of the specified date
 */
export const getWeekDays = (date) => {
    let day = getFirstDayOfWeek(date);
    const res = [day];
    let i = DAYS_IN_WEEK - 1;
    while (i) {
        day = shiftDate(day, 1);
        res.push(day);
        i -= 1;
    }

    return res;
};

/**
 * Check two dates has the same year and month
 */
export const isSameYearMonth = (dateA, dateB) => (
    dateA.getFullYear() === dateB.getFullYear()
    && dateA.getMonth() === dateB.getMonth()
);

/**
 * Check two dates has the same year, month and day
 */
export const isSameDate = (dateA, dateB) => (
    dateA.getFullYear() === dateB.getFullYear()
    && dateA.getMonth() === dateB.getMonth()
    && dateA.getDate() === dateB.getDate()
);

/**
 * Returns long weekday name for specified date
 */
export const getWeekdayLong = (date, locales = []) => {
    const weekdayName = formatDate(date, locales, { weekday: 'long' });
    return firstUpperCase(weekdayName, locales);
};

/**
 * Returns short weekday name for specified date
 */
export const getWeekdayShort = (date, locales = []) => {
    const weekdayName = formatDate(date, locales, { weekday: 'short' });
    return firstUpperCase(weekdayName.substr(0, 3), locales);
};

/**
 * Returns long month name for specified date
 */
export const getLongMonthName = (date, locales = []) => {
    const monthName = formatDate(date, locales, { month: 'long' });
    return firstUpperCase(monthName, locales);
};

/**
 * Returns short month name for specified date
 */
export const getShortMonthName = (date, locales = []) => {
    const monthName = formatDate(date, locales, { month: 'short' });
    return firstUpperCase(monthName.substr(0, 3), locales);
};
