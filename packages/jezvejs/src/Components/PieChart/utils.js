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
export const svgValue = (val, prec = 5) => (
    parseFloat(parseFloat(val).toFixed(prec))
);

/** Format circular arc command for SVG path element */
export const circularArcCommand = (radius, large, clockwise, dx, dy) => (
    `a${radius} ${radius} 0 ${large} ${clockwise} ${dx} ${dy}`
);

/** Format circular arc command for SVG path element */
export const circularArc = (x, y, radius, startDeg, arcDeg, offset, clockwise = true) => {
    // center of circle point
    let centerX = parseFloat(x);
    let centerY = parseFloat(y);
    if (Number.isNaN(centerX) || Number.isNaN(centerY)) {
        throw new Error(`Invalid coordinates: (${x}; ${y})`);
    }

    const r = parseFloat(radius);
    if (Number.isNaN(r) || r === 0.0) {
        throw new Error(`Invalid radius: ${r}`);
    }

    const a = toRadian(arcDeg);
    const b = toRadian(startDeg);
    const large = (a < Math.PI) ? 0 : 1;

    if (typeof offset !== 'undefined') {
        const offs = parseFloat(offset);
        if (Number.isNaN(offs)) {
            throw new Error(`Invalid offset: ${offset}`);
        }

        const c = b + (a / 2);
        const offsetX = offs * Math.cos(-c);
        const offsetY = offs * Math.sin(-c);
        centerX += offsetX;
        centerY += offsetY;
    }

    // Start point
    const startX = centerX + r * Math.cos(a + b);
    const startY = centerY - r * Math.sin(a + b);
    // End point
    const endX = centerX + r * Math.cos(b);
    const endY = centerY - r * Math.sin(b);
    // Shift from start point to end point
    const deltaX = (clockwise) ? (endX - startX) : (startX - endX);
    const deltaY = (clockwise) ? (endY - startY) : (startY - endY);

    const command = circularArcCommand(
        svgValue(r),
        large,
        (clockwise) ? 1 : 0,
        svgValue(deltaX),
        svgValue(deltaY),
    );

    return {
        centerX,
        centerY,
        startX,
        startY,
        endX,
        endY,
        deltaX,
        deltaY,
        large,
        command,
    };
};
