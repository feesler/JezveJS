/**
 * Fixes string to correct number format if possible and returns result
 * @param {string|number} str - decimal value string
 */
export const fixFloat: (str: string | number) => string | null;

/**
 * Returns count of decimal places for number including decimal point
 * @param {string|Number} value
 */
export const getDecimalPlaces: (value: string | number) => number;

/**
 * Trims decimal places of value up to specified limit and returns result
 * @param {string} value
 * @param {number} limit
 */
export const trimDecimalPlaces: (value: string, limit: number) => string;

/** Returns allowed length of fractional part of number: decimal point and digits after */
export const getAllowedDecimalPlaces: (digits: number) => number;

/**
 * Returns true if string matches to decimal value pattern
 * @param {string} value
 */
export const isNumberString: (value: string) => boolean;

/**
 * Returns true if string starts with multiple '0' and optional minus sign
 * @param {string} value
 */
export const isMultipleLeadingZeros: (value: string) => boolean;
