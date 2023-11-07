import { minmax } from '../../js/common.js';

export const valueToPosition = (value, minValue, maxValue, maxPos) => (
    maxPos * Math.abs((value - minValue) / (minValue - maxValue))
);

export const positionToValue = (pos, minValue, maxValue, maxPos) => (
    minmax(minValue, maxValue, minValue + (pos * Math.abs(maxValue - minValue)) / maxPos)
);
