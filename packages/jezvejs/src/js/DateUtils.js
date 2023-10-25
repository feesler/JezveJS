import { isDate } from '@jezvejs/types';

export const DAYS_IN_WEEK = 7;
export const DEFAULT_FIRST_DAY_OF_WEEK = 7;
export const MONTHS_COUNT = 12;

/** Returns fixed date locale string without RTL characters */
export const formatDate = (date, params = {}) => (
    date.toLocaleDateString(params?.locales ?? [], params?.options ?? {}).replace(/\u200e/g, '')
);

/** Returns object with positions of date parts and separator */
export const getLocaleDateFormat = (params = {}) => {
    const formatter = Intl.DateTimeFormat(params?.locales ?? [], params?.options ?? {});
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
export const parseDateString = (str, params = {}) => {
    if (typeof str !== 'string' || str.length === 0) {
        return NaN;
    }

    const format = getLocaleDateFormat(params);
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

    const { fixShortYear = true } = params;

    if (year < 100 && (fixShortYear || format.yearLength === 2)) {
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
export const isValidDateString = (str, params = {}) => (
    isDate(parseDateString(str, params))
);

/** Returns a new date shifted by the specified number of years */
export const shiftYear = (date, shift) => (
    new Date(Date.UTC(
        date.getFullYear() + shift,
        date.getMonth(),
        date.getDate(),
    ))
);

/** Returns a new date shifted by the specified number of months */
export const shiftMonth = (date, shift) => (
    new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth() + shift,
        date.getDate(),
    ))
);

/** Returns a new date shifted by the specified number of days */
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

export const getLocaleFirstDayOfWeek = (locales) => {
    try {
        const resolved = new Intl.DateTimeFormat(locales).resolvedOptions();
        const locale = new Intl.Locale(resolved.locale);
        return locale.weekInfo?.firstDay;
    } catch {
        return null;
    }
};

/**
 * Return monday on week of the specified date
 */
export const getFirstDayOfWeek = (date, params = {}) => {
    let firstDay = params?.options?.firstDay;

    if (typeof firstDay !== 'number') {
        firstDay = (params?.locales)
            ? getLocaleFirstDayOfWeek(params.locales)
            : DEFAULT_FIRST_DAY_OF_WEEK;
    }

    const day = (firstDay === 1)
        ? getMondayBasedDayOfWeek(date)
        : date.getDay();
    return shiftDate(date, -day);
};

/**
 * Returns array of days for week of the specified date
 */
export const getWeekDays = (date, params = {}) => {
    let day = getFirstDayOfWeek(date, params);
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
export const getWeekdayLong = (date, locales = []) => (
    formatDate(date, { locales, options: { weekday: 'long' } })
);

/**
 * Returns short weekday name for specified date
 */
export const getWeekdayShort = (date, locales = []) => (
    formatDate(date, { locales, options: { weekday: 'short' } })
        .substring(0, 3)
);

/**
 * Returns long month name for specified date
 */
export const getLongMonthName = (date, locales = []) => (
    formatDate(date, { locales, options: { month: 'long' } })
);

/**
 * Returns short month name for specified date
 */
export const getShortMonthName = (date, locales = []) => (
    formatDate(date, { locales, options: { month: 'short' } })
        .substring(0, 3)
);
