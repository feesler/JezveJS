export const DAYS_IN_WEEK: number;
export const DEFAULT_FIRST_DAY_OF_WEEK: number;
export const MONTHS_COUNT: number;

export type LocalesType = string | string[];

export interface FormatDateParam {
    locales?: LocalesType;
    options?: object;
}

/** Returns fixed date locale string without RTL characters */
export const formatDate: (date: Date, params: FormatDateParam = {}) => string;

export interface DateFormatPartType {
    type: string;
    start: number;
    end: number;
    length: number;
    value?: string;
    order?: number;
}

export interface DateFormatType {
    dayIndex: number,
    monthIndex: number,
    yearIndex: number,
    yearLength: number,
    separator: string | null;
    formatParts: DateFormatPartType[];
    dayRange?: DateFormatPartType;
    monthRange?: DateFormatPartType;
    yearRange?: DateFormatPartType;
    formatMask: string | null;
}

export type GetLocaleDateFormatParam = FormatDateParam;

/** Returns object with positions of date parts and separator */
export const getLocaleDateFormat: (params: GetLocaleDateFormatParam = {}) => DateFormatType;

export interface ParseDateStringParam extends GetLocaleDateFormatParam {
    fixShortYear?: boolean;
}

/** Returns date parsed from string accodring to specified locale */
export const parseDateString: (str: string, params: ParseDateStringParam = {}) => Date | NaN;

/** Returns true if specified argument is valid date string for current locale */
export const isValidDateString: (str: string, params: ParseDateStringParam = {}) => boolean;

/** Returns a new date shifted by the specified number of years */
export const shiftYear: (date: Data, shift: number) => Data;

/** Returns a new date shifted by the specified number of months */
export const shiftMonth: (date: Data, shift: number) => Data;

/** Returns a new date shifted by the specified number of days */
export const shiftDate: (date: Date, shift: number) => Data;

/**
 * Returns the ISO week of the date
 *
 * @param {number} timestamp
 * @returns {number}
 */
export const getWeek: (timestamp: number) => number;

/**
 * Returns last day in month of the specified date
 *
 * @param {Date} date
 * @returns {Date}
 */
export const getLastDayOfMonth: (date: Date) => Date;

/**
 * Return count of days in month of the specified date
 */
export const getDaysInMonth: (date: Date) => number;

/**
 * Return monday based(0 - monday, 6 - sunday) day of week of specified date
 */
export const getMondayBasedDayOfWeek: (date: Date) => number;

export const getLocaleFirstDayOfWeek: (locales: LocalesType) => number | null;

/**
 * getFirstDayOfWeek() and getWeekDays() function parameters
 */
export interface GetWeekDaysParam {
    options?: {
        firstDay?: number;
    };
    locales?: LocalesType;
}

/**
 * Return monday on week of the specified date
 */
export const getFirstDayOfWeek: (date: Date, params: GetWeekDaysParam = {}) => number;

/**
 * Returns array of days for week of the specified date
 */
export const getWeekDays: (date: Date, params: GetWeekDaysParam = {}) => Date[];

/**
 * Check two dates has the same year and month
 */
export const isSameYearMonth: (dateA, dateB) => boolean;

/**
 * Check two dates has the same year, month and day
 */
export const isSameDate: (dateA, dateB) => boolean;

/**
 * Returns long weekday name for specified date
 */
export const getWeekdayLong: (date, locales: LocalesType = []) => string;

/**
 * Returns short weekday name for specified date
 */
export const getWeekdayShort: (date, locales: LocalesType = []) => string;

/**
 * Returns long month name for specified date
 */
export const getLongMonthName: (date, locales: LocalesType = []) => string;

/**
 * Returns short month name for specified date
 */
export const getShortMonthName: (date, locales: LocalesType = []) => string;

/**
 * Returns formatted time string for specified value
 * @param {number} time
 * @param {LocalesType} locales
 * @returns {string}
 */
export const formatTime: (time: number, locales: LocalesType = []) => string;
