/* eslint-disable no-bitwise */

/** Convert degrees to radians */
export const toRadian = (val) => {
    const fval = parseFloat(val);
    if (Number.isNaN(fval)) {
        throw new Error('Invalid value');
    }

    return (fval % 360) * (Math.PI / 180);
};

/** Format value as hexadecimal */
export const toHex = (val) => {
    const v = parseInt(val, 10);
    if (Number.isNaN(v)) {
        throw new Error('Invalid data');
    }

    return ((v < 0x10) ? '0' : '') + v.toString(16);
};

/** Format color as hexadecimal */
export const hexColor = (val) => {
    const r = (val & 0xFF0000) >> 16;
    const g = (val & 0x00FF00) >> 8;
    const b = (val & 0x0000FF);

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/** Format float value for SVG */
export const svgValue = (val, prec = 5) => parseFloat(val).toFixed(prec);
