import { setBlock } from 'jezve-test';
import * as CommonTests from '../run/common.js';
import { App } from '../app.js';

const deepMeetTests = async () => {
    setBlock('deepMeet() function', 1);

    const data = [{
        value: 1, expected: 1, result: true, descr: 'Compare numbers',
    }, {
        value: 'string', expected: 'string', result: true, descr: 'Compare strings',
    }, {
        value: null, expected: null, result: true, descr: 'Compare null',
    }, {
        value: NaN, expected: NaN, result: true, descr: 'Compare NaN',
    }, {
        value: undefined, expected: undefined, result: true, descr: 'Compare undefined',
    }, {
        value: {}, expected: {}, result: true, descr: 'Compare empty objects',
    }, {
        value: null, expected: {}, result: false, descr: 'Compare null with empty object',
    }, {
        value: {}, expected: null, result: false, descr: 'Compare empty object with null',
    }, {
        value: undefined, expected: {}, result: false, descr: 'Compare undefined with empty object',
    }, {
        value: {}, expected: undefined, result: true, descr: 'Compare empty object with undefined',
    }, {
        value: undefined, expected: [1, 2, 3], result: false, descr: 'Compare undefined with array',
    }, {
        value: [], expected: [], result: true, descr: 'Compare empty arrays',
    }, {
        value: [1, 2, 3],
        expected: [1, 2, 3],
        result: true,
        descr: 'Compare arrays with primitives',
    }, {
        value: [1, 2, 3, 4, 5],
        expected: [1, 2, 3],
        result: false,
        descr: 'Compare arrays with different length',
    }, {
        value: [1, 2, null, NaN],
        expected: [1, 2, null, NaN],
        result: true,
        descr: 'Compare arrays with primitives and null and NaN',
    }, {
        value: [1, 2, 3], expected: undefined, result: true, descr: 'Compare array with undefined',
    }, {
        value: [1, 2], expected: [1, 2, null], result: false, descr: 'Compare arrays',
    }, {
        value: { a: 1 },
        expected: { a: 1 },
        result: true,
        descr: 'Compare objects with properties',
    }, {
        value: { a: 1 },
        expected: { b: 2 },
        result: false,
        descr: 'Compare objects with properties',
    }, {
        value: { a: 1, c: null },
        expected: { a: 1, c: null },
        result: true,
        descr: 'Compare objects with properties',
    }, {
        value: { a: { a1: '' }, d: [{ d1: true }] },
        expected: { a: { a1: '' }, d: [{ d1: true }] },
        result: true,
        descr: 'Compare objects with properties',
    }, {
        value: [{ a: 1 }, { b: 2 }],
        expected: [{ a: 1 }, { b: 2 }, { c: 3 }],
        result: false,
        descr: 'Compare arrays of objects',
    }];

    await App.scenario.runner.runGroup(CommonTests.deepMeetTest, data);
};

const minMaxTests = async () => {
    setBlock('minmax() function', 1);

    setBlock('Integer values', 2);
    await CommonTests.minMaxTest(1, 10, 5, 5);
    await CommonTests.minMaxTest(1, 10, 15, 10);
    await CommonTests.minMaxTest(1, 10, 0, 1);
    await CommonTests.minMaxTest(1, 10, -5, 1);

    setBlock('Float values', 2);
    await CommonTests.minMaxTest(-15.5, 15.5, 5.5, 5.5);
    await CommonTests.minMaxTest(-15.5, 15.5, 15.6, 15.5);
    await CommonTests.minMaxTest(-15.5, 15.5, 0, 0);
    await CommonTests.minMaxTest(-15.5, 15.5, -15.55, -15.5);

    setBlock('Inverted range arguments', 2);
    await CommonTests.minMaxTest(20, 10, 15, 15);
    await CommonTests.minMaxTest(-10, -20, 15, -10);

    setBlock('Same range arguments', 2);
    await CommonTests.minMaxTest(10, 10, 15, 10);
    await CommonTests.minMaxTest(10, 10, -15, 10);
    await CommonTests.minMaxTest(10, 10, 10, 10);
    await CommonTests.minMaxTest(-10, -10, 15, -10);
    await CommonTests.minMaxTest(-10, -10, 0, -10);
    await CommonTests.minMaxTest(-10, -10, -10, -10);

    setBlock('Invalid arguments', 2);
    await CommonTests.minMaxTest(null, -10, 1, 0);
    await CommonTests.minMaxTest(undefined, 1, 5, NaN);
    await CommonTests.minMaxTest(NaN, null, undefined, NaN);
    await CommonTests.minMaxTest({}, null, 5, NaN);
    await CommonTests.minMaxTest(() => { }, null, 5, NaN);
    await CommonTests.minMaxTest(1, 10, NaN, NaN);
};

export const commonTests = async () => {
    setBlock('Common', 1);

    await deepMeetTests();
    await minMaxTests();
};
