import { minmax } from '../../js/common.js';

export const valueToPosition = (value, minValue, maxValue, maxPos) => (
    Math.ceil(maxPos * Math.abs((value - minValue) / (minValue - maxValue)))
);

export const positionToValue = (pos, minValue, maxValue, maxPos) => (
    minmax(
        minValue,
        maxValue,
        minValue + (pos * Math.abs(maxValue - minValue)) / Math.floor(maxPos),
    )
);

export const getStepPrecision = (step) => {
    const exp = Math.floor(Math.log10(step));
    return (exp < 0) ? -exp : 1;
};

export const roundToPrecision = (value, prec) => (
    parseFloat(value.toFixed(prec))
);

export const stepValue = (value, step, prec) => (
    roundToPrecision(Math.round(value / step) * step, prec)
);
