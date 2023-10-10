import { asArray, minmax } from './common.js';

/* eslint-disable no-bitwise */

export const MAX_HUE = 360;
export const MAX_LIGHTNESS = 100;
export const MAX_SATURATION = 100;

/**
 * Converts color string to integer and returns result
 * @param {string|number} value
 * @returns {number}
 */
export const colorToInt = (value) => (
    (
        (typeof value === 'number')
            ? value
            : parseInt(
                (
                    (typeof value === 'string' && value.startsWith('#'))
                        ? value.substring(1)
                        : value
                ),
                16,
            )
    ) & 0xffffff
);

/**
 * Converts integer value to color string and returns result
 * @param {number} value
 * @returns {string}
 */
export const intToColor = (value) => (
    `#${(value & 0xffffff).toString(16).padStart(6, '0')}`
);

/**
 * Returns RGB object for specified color
 * @param {number} value
 * @returns {object}
 */
export const getRGB = (value) => {
    const color = colorToInt(value);
    return {
        red: ((color >> 16) & 0xff),
        green: ((color >> 8) & 0xff),
        blue: (color & 0xff),
    };
};

/**
 * Converts RBG color object to integer value and returns result
 * @param {object} color
 * @returns {number}
 */
export const rgbToInt = (color) => (
    ((color.red & 0xff) << 16)
    + ((color.green & 0xff) << 8)
    + (color.blue & 0xff)
);

/**
 * Converts RBG color object to color string and returns result
 * @param {object} color
 * @returns {string}
 */
export const rgbToColor = (color) => (
    intToColor(rgbToInt(color))
);

/**
 * Returns color channel value normalized from 0..255 to 0..1 range
 * @param {number|string} value
 * @returns {number}
 */
export const normalizeChannel = (value) => (
    (parseInt(value, 10) & 0xff) / 255
);

/**
 * Calculates part of color channel for relative luminance and returns result
 * @param {number|string} value - red, green or blue channel of color
 * @returns {number}
 */
export const getChannelLuminance = (value) => {
    const n = normalizeChannel(value);
    return (n <= 0.04045) ? (n / 12.92) : (((n + 0.055) / 1.055) ** 2.24);
};

/**
 * Returns relative luminance for specified color
 * @param {string|number} color
 * @returns {number}
 */
export const getLuminance = (color) => {
    const rgb = getRGB(color);
    return (
        getChannelLuminance(rgb.red) * 0.2126
        + getChannelLuminance(rgb.green) * 0.7152
        + getChannelLuminance(rgb.blue) * 0.0722
    );
};

/**
 * Calculates contrast ratio between specified colors and returns result
 * @param {string|number} color
 * @param {string|number} background
 * @returns {number}
 */
export const getContrastRatio = (color, background) => {
    const lc = getLuminance(color);
    const lb = getLuminance(background);
    const l1 = Math.max(lc, lb);
    const l2 = Math.min(lc, lb);
    return (l1 + 0.05) / (l2 + 0.05);
};

/**
 * Returns most contrast color from specified list relative to the base color
 * @param {string|number} baseColor
 * @param {string|number|Array} secondaryColors
 * @returns {number}
 */
export const getContrastColor = (baseColor, secondaryColors) => {
    const base = colorToInt(baseColor);
    const secondary = asArray(secondaryColors).reduce((res, item) => {
        const color = colorToInt(item);
        const contrastRatio = getContrastRatio(base, color);
        return (contrastRatio > res.contrastRatio)
            ? { color, contrastRatio }
            : res;
    }, { contrastRatio: 0 });

    const res = secondary?.color ?? null;
    return (res === null) ? null : intToColor(res);
};

/**
 * Converts RGB color to HSL and returns result
 * @param {number|string} color
 * @returns {object}
 */
export const rgbToHSL = (color) => {
    let { red, green, blue } = getRGB(color);
    red = normalizeChannel(red);
    green = normalizeChannel(green);
    blue = normalizeChannel(blue);
    const cMax = Math.max(red, green, blue);
    const cMin = Math.min(red, green, blue);
    const delta = cMax - cMin;
    let hue = 0;
    let saturation = 0;
    let lightness = 0;

    if (delta === 0) {
        hue = 0;
    } else if (cMax === red) {
        hue = ((green - blue) / delta) % 6;
    } else if (cMax === green) {
        hue = ((blue - red) / delta) + 2;
    } else {
        hue = ((red - green) / delta) + 4;
    }

    hue = Math.round(hue * 60);
    while (hue < 0) {
        hue += MAX_HUE;
    }

    lightness = (cMax + cMin) / 2;
    saturation = (delta === 0)
        ? 0
        : (delta / (1 - Math.abs(2 * lightness - 1)));

    saturation = +(saturation * MAX_SATURATION).toFixed(1);
    lightness = +(lightness * MAX_LIGHTNESS).toFixed(1);

    return { hue, saturation, lightness };
};

/**
 * Converts HSL color object to RGB and returns result
 * @param {number|string} color
 * @returns {object}
 */
export const hslToRGB = (color) => {
    let { hue, saturation, lightness } = color;
    hue %= MAX_HUE;
    saturation = minmax(0, MAX_SATURATION, saturation) / MAX_SATURATION;
    lightness = minmax(0, MAX_LIGHTNESS, lightness) / MAX_LIGHTNESS;

    const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
    const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = lightness - chroma / 2;
    let red = 0;
    let green = 0;
    let blue = 0;

    if (hue >= 0 && hue < 60) {
        red = chroma;
        green = x;
    } else if (hue >= 60 && hue < 120) {
        red = x;
        green = chroma;
    } else if (hue >= 120 && hue < 180) {
        green = chroma;
        blue = x;
    } else if (hue >= 180 && hue < 240) {
        green = x;
        blue = chroma;
    } else if (hue >= 240 && hue < 300) {
        red = x;
        blue = chroma;
    } else if (hue >= 300 && hue < 360) {
        red = chroma;
        blue = x;
    }
    red = Math.round((red + m) * 255);
    green = Math.round((green + m) * 255);
    blue = Math.round((blue + m) * 255);

    return { red, green, blue };
};
