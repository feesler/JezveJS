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

const fixFloatTests = async () => {
    setBlock('fixFloat', 1);

    setBlock('Number values', 2);
    await CommonTests.fixFloatTest('Integer number', 100, '100');
    await CommonTests.fixFloatTest('Float number', 100.5, '100.5');

    setBlock('Invalid values', 2);
    await CommonTests.fixFloatTest('null value', null, null);
    await CommonTests.fixFloatTest('undefined value', undefined, null);
    await CommonTests.fixFloatTest('NaN value', NaN, null);

    setBlock('Zero strings', 2);
    // [value, expected result]
    const zeroPairs = [
        ['.', '0.'],
        ['.0', '0.0'],
        ['.00', '0.00'],
        ['0', '0'],
        ['0.', '0.'],
        ['0.0', '0.0'],
        ['0.00', '0.00'],
    ];
    const negZeroPairs = [
        ['-', '-0'],
        ['-.', '-0.'],
        ['-.0', '-0.0'],
        ['-0', '-0'],
        ['-0.', '-0.'],
        ['-0.0', '-0.0'],
        ['-0.00', '-0.00'],
    ];

    await App.scenario.runner.runGroup(([value, expected]) => (
        CommonTests.fixFloatTest(`Zero string '${value}'`, value, expected)
    ), zeroPairs);

    setBlock('Negative zero strings', 2);
    await App.scenario.runner.runGroup(([value, expected]) => (
        CommonTests.fixFloatTest(`Negative zero string '${value}'`, value, expected)
    ), negZeroPairs);

    setBlock('Strings', 2);
    await CommonTests.fixFloatTest('Empty string', '', '0');
    await CommonTests.fixFloatTest('Integer number string', '123', '123');
    await CommonTests.fixFloatTest('Float number string with point', '123.5', '123.5');
    await CommonTests.fixFloatTest('Float number string with comma', '123,5', '123.5');
    await CommonTests.fixFloatTest('Float number string starts with point', '.56', '0.56');
    await CommonTests.fixFloatTest('Float number string starts with comma', ',56', '0.56');
};

const trimDecimalTests = async () => {
    setBlock('trimDecimalPlaces() function', 1);

    await CommonTests.trimDecimalTest('10.12345', 7, '10.12345');
    await CommonTests.trimDecimalTest('10.12345', 6, '10.12345');
    await CommonTests.trimDecimalTest('10.12345', 5, '10.12345');
    await CommonTests.trimDecimalTest('10.12345', 4, '10.1234');
    await CommonTests.trimDecimalTest('10.12345', 3, '10.123');
    await CommonTests.trimDecimalTest('10.12345', 2, '10.12');
    await CommonTests.trimDecimalTest('10.12345', 1, '10.1');
    await CommonTests.trimDecimalTest('10.12345', 0, '10');
    await CommonTests.trimDecimalTest('-10.12345', 7, '-10.12345');
    await CommonTests.trimDecimalTest('-10.12345', 6, '-10.12345');
    await CommonTests.trimDecimalTest('-10.12345', 5, '-10.12345');
    await CommonTests.trimDecimalTest('-10.12345', 4, '-10.1234');
    await CommonTests.trimDecimalTest('-10.12345', 3, '-10.123');
    await CommonTests.trimDecimalTest('-10.12345', 2, '-10.12');
    await CommonTests.trimDecimalTest('-10.12345', 1, '-10.1');
    await CommonTests.trimDecimalTest('-10.12345', 0, '-10');
};

export const commonTests = async () => {
    setBlock('Common', 1);

    await deepMeetTests();
    await minMaxTests();
    await fixFloatTests();
    await trimDecimalTests();
};
