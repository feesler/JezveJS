import { test } from 'jezve-test';
import { assert } from '@jezvejs/assert';

import { deepMeet, minmax } from '../../packages/jezvejs/src/js/common.js';
import { fixFloat, trimDecimalPlaces } from '../../packages/utils/number/src/index.js';
import {
    colorToInt,
    hslToRGB,
    intToColor,
    rgbToHSL,
} from '../../packages/jezvejs/src/js/colorUtils.js';
import { formatObject } from '../common.js';

export const deepMeetTest = async ({
    descr,
    value,
    expected,
    result,
}) => {
    await test(descr, () => {
        const funcResult = deepMeet(value, expected);

        assert(funcResult === result, `Unexpected result: ${funcResult}. ${result} is expected.`);

        return true;
    });
};

export const minMaxTest = async (
    min,
    max,
    value,
    result,
) => {
    await test(`minmax(${min}, ${max}, ${value})`, () => {
        const funcResult = minmax(min, max, value);

        assert.equal(funcResult, result, `Unexpected result: ${funcResult}. ${result} is expected.`);

        return true;
    });
};

export const fixFloatTest = async (descr, value, result) => {
    await test(descr, () => {
        assert.equal(fixFloat(value), result);
        return true;
    });
};

export const trimDecimalTest = async (value, limit, result) => {
    await test(`trimDecimalPlaces(${value}, ${limit})`, () => {
        const funcResult = trimDecimalPlaces(value, limit);

        assert.equal(funcResult, result, `Unexpected result: ${funcResult}. ${result} is expected.`);

        return true;
    });
};

export const colorToIntTest = async (value, result) => {
    await test(`colorToInt(${value})`, () => {
        const funcResult = colorToInt(value);
        assert.equal(funcResult, result, `Unexpected result: ${funcResult}. ${result} is expected.`);
        return true;
    });
};

export const intToColorTest = async (value, result) => {
    await test(`intToColor(${value})`, () => {
        const funcResult = intToColor(value);
        assert.equal(funcResult, result, `Unexpected result: ${funcResult}. ${result} is expected.`);
        return true;
    });
};

export const rgbToHSLTest = async (value, result) => {
    await test(`rgbToHSL(${formatObject(value)})`, () => {
        const funcResult = rgbToHSL(value);

        const expected = formatObject(result);
        const res = formatObject(funcResult);
        assert.deepMeet(funcResult, result, `Unexpected result: ${res}. ${expected} is expected.`);

        return true;
    });
};

export const hslToRGBTest = async (value, result) => {
    await test(`hslToRGB(${formatObject(value)})`, () => {
        const funcResult = hslToRGB(value);

        const expected = formatObject(result);
        const res = formatObject(funcResult);
        assert.deepMeet(funcResult, result, `Unexpected result: ${res}. ${expected} is expected.`);

        return true;
    });
};
