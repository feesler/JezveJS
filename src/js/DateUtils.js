export const DAYS_IN_WEEK = 7;
export const MONTHS_COUNT = 12;

function firstUpperCase(str, locales = []) {
    const first = str.substring(0, 1);
    const rest = str.substring(1);

    return first.toLocaleUpperCase(locales)
        .concat(rest.toLocaleLowerCase(locales));
}

/** Return fixed locale string without RTL characters */
export const dateToLocaleString = (date, locales, options) => (
    date.toLocaleString(locales, options).replace(/\u200e/g, '')
);

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
 * Return monday on week of the sspecified date
 */
export const getFirstDayOfWeek = (date) => {
    const day = getMondayBasedDayOfWeek(date);
    return shiftDate(date, -day);
};

/**
 * Returns long weekday name for specified date
 */
export const getWeekdayLong = (date, locales = []) => {
    const weekdayName = date.toLocaleString(locales, { weekday: 'long' });
    return firstUpperCase(weekdayName, locales);
};

/**
 * Returns short weekday name for specified date
 */
export const getWeekdayShort = (date, locales = []) => {
    const weekdayName = dateToLocaleString(date, locales, { weekday: 'short' });
    return firstUpperCase(weekdayName.substr(0, 3), locales);
};

/**
 * Returns long month name for specified date
 */
export const getLongMonthName = (date, locales = []) => {
    const monthName = dateToLocaleString(date, locales, { month: 'long' });
    return firstUpperCase(monthName, locales);
};

/**
 * Returns short month name for specified date
 */
export const getShortMonthName = (date, locales = []) => {
    const monthName = dateToLocaleString(date, locales, { month: 'short' });
    return firstUpperCase(monthName.substr(0, 3), locales);
};
