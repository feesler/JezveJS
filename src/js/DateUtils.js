export const DAYS_IN_WEEK = 7;
export const MONTHS_COUNT = 12;

function firstUpperCase(str, locales = []) {
    const first = str.substring(0, 1);
    const rest = str.substring(1);

    return first.toLocaleUpperCase(locales)
        .concat(rest.toLocaleLowerCase(locales));
}

/** Return fixed locale string without RTL characters */
export const dateToLocaleDateString = (date, locales = [], options = {}) => (
    date.toLocaleDateString(locales, options).replace(/\u200e/g, '')
);

/** Returns short-style formatted date string */
export const formatDate = (date, locales = []) => (
    dateToLocaleDateString(date, locales)
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
    const weekdayName = dateToLocaleDateString(date, locales, { weekday: 'long' });
    return firstUpperCase(weekdayName, locales);
};

/**
 * Returns short weekday name for specified date
 */
export const getWeekdayShort = (date, locales = []) => {
    const weekdayName = dateToLocaleDateString(date, locales, { weekday: 'short' });
    return firstUpperCase(weekdayName.substr(0, 3), locales);
};

/**
 * Returns long month name for specified date
 */
export const getLongMonthName = (date, locales = []) => {
    const monthName = dateToLocaleDateString(date, locales, { month: 'long' });
    return firstUpperCase(monthName, locales);
};

/**
 * Returns short month name for specified date
 */
export const getShortMonthName = (date, locales = []) => {
    const monthName = dateToLocaleDateString(date, locales, { month: 'short' });
    return firstUpperCase(monthName.substr(0, 3), locales);
};
