import { assert, test } from 'jezve-test';
import { deepMeet } from '../../src/js/common.js';

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
