/* eslint-disable @typescript-eslint/no-explicit-any */

/** Checks if a parameter is Date */
export const isDate: (obj: any) => boolean;

/** Checks if a parameter is function */
export const isFunction: (obj: any) => boolean;

/** Checks if a parameter is instance of Object */
export const isObject: (obj: any) => boolean;

/** Checks if a parameter is Number or valid number string */
export const isNumber: (val: any) => boolean;

/** Checks if a parameter is integer Number or valid integer string */
export const isInteger: (x: any) => boolean;

/** Checks if a parameter is array */
export const isArray: (obj: any) => boolean;

/** Returns parameter if it is array, else wrap value to array */
export const asArray: (value: any | any[] | null | undefined) => any[];
