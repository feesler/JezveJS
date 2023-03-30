import { assert, test } from 'jezve-test';
import { deepMeet, minmax } from '../../packages/jezvejs/src/js/common.js';
import { fixFloat, trimDecimalPlaces } from '../../packages/jezvejs/src/js/NumberUtils.js';

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

export const trimDecimalTest = async (
    value,
    limit,
    result,
) => {
    await test(`trimDecimalPlaces(${value}, ${limit})`, () => {
        const funcResult = trimDecimalPlaces(value, limit);

        assert.equal(funcResult, result, `Unexpected result: ${funcResult}. ${result} is expected.`);

        return true;
    });
};
