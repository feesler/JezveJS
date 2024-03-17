import { minmax } from '../../common.js';

export const valueToPosition = (value, minValue, maxValue, maxPos) => {
    const fixedValue = minmax(minValue, maxValue, value);
    return maxPos * Math.abs((fixedValue - minValue) / (minValue - maxValue));
};

export const positionToValue = (pos, minValue, maxValue, maxPos) => (
    minmax(
        minValue,
        maxValue,
        minValue + (pos * Math.abs(maxValue - minValue)) / Math.floor(maxPos),
    )
);

export const getStepPrecision = (step) => {
    if (!Number.isFinite(step) || step === 0) {
        return null;
    }

    const absStep = Math.abs(step);
    const fractional = absStep - Math.floor(absStep);
    if (fractional === 0) {
        return 1;
    }

    const exp = Math.floor(Math.log10(fractional));
    return (exp < 0) ? -exp : 1;
};

export const roundToPrecision = (value, prec) => (
    Number.isFinite(prec)
        ? parseFloat(value.toFixed(prec))
        : value
);

export const stepValue = (value, step, prec) => (
    Number.isFinite(prec)
        ? roundToPrecision(Math.round(value / step) * step, prec)
        : value
);
