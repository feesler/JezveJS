export interface HSLColorObject {
    hue: number;
    saturation: number;
    lightness: number;
}

export interface RGBColorObject {
    red: number;
    green: number;
    blue: number;
}

export type PrimitiveColor = number | string;

export const MAX_HUE: number;
export const MAX_LIGHTNESS: number;
export const MAX_SATURATION: number;

/**
 * Converts color string to integer and returns result
 * @param {number|string} value
 * @returns {number}
 */
export const colorToInt: (value: PrimitiveColor) => number;

/**
 * Converts integer value to color string and returns result
 * @param {number} value
 * @returns {string}
 */
export const intToColor: (value: number) => string;

/**
 * Returns RGB object for specified color
 * @param {number} value
 * @returns {object}
 */
export const getRGB: (value: PrimitiveColor) => RGBColorObject;

/**
 * Converts RBG color object to integer value and returns result
 * @param {object} color
 * @returns {number}
 */
export const rgbToInt: (color: RGBColorObject) => number;

/**
 * Converts RBG color object to color string and returns result
 * @param {object} color
 * @returns {string}
 */
export const rgbToColor: (color: RGBColorObject) => string;

/**
 * Returns color channel value normalized from 0..255 to 0..1 range
 * @param {number|string} value
 * @returns {number}
 */
export const normalizeChannel: (value: PrimitiveColor) => number;

/**
 * Calculates part of color channel for relative luminance and returns result
 * @param {number|string} value - red, green or blue channel of color
 * @returns {number}
 */
export const getChannelLuminance: (value: PrimitiveColor) => number;

/**
 * Returns relative luminance for specified color
 * @param {number|string} color
 * @returns {number}
 */
export const getLuminance: (color: PrimitiveColor) => number;

/**
 * Calculates contrast ratio between specified colors and returns result
 * @param {number|string} color
 * @param {number|string} background
 * @returns {number}
 */
export const getContrastRatio: (color: PrimitiveColor, background: PrimitiveColor) => number;

/**
 * Returns most contrast color from specified list relative to the base color
 * @param {number|string} baseColor
 * @param {number|string|Array} secondaryColors
 * @returns {number}
 */
export const getContrastColor: (
    baseColor: PrimitiveColor,
    secondaryColors: PrimitiveColor | PrimitiveColor[],
) => PrimitiveColor | null;

/**
 * Converts RGB color to HSL and returns result
 * @param {number|string} color
 * @returns {object}
 */
export const rgbToHSL: (color: PrimitiveColor) => HSLColorObject;

/**
 * Converts HSL color object to RGB and returns result
 * @param {number|string} color
 * @returns {object}
 */
export const hslToRGB: (color: HSLColorObject) => RGBColorObject;
