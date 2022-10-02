import { setBlock } from 'jezve-test';
import * as CommonTests from '../run/common.js';
import { App } from '../app.js';

export const commonTests = async () => {
    setBlock('Common', 1);

    setBlock('deepMeet() function', 2);
    const data = [{
        value: 1, expected: 1, result: true, descr: 'Compare numbers',
    }, {
        value: 'string', expected: 'string', result: true, descr: 'Compare strings',
    }, {
        value: null, expected: null, result: true, descr: 'Compare null',
    }, {
        value: undefined, expected: undefined, result: true, descr: 'Compare undefined',
    }, {
        value: {}, expected: {}, result: true, descr: 'Compare empty objects',
    }, {
        value: [], expected: [], result: true, descr: 'Compare empty arrays',
    }, {
        value: [1, 2, null],
        expected: [1, 2, null],
        result: true,
        descr: 'Compare arrays with primitives',
    }, {
        value: null, expected: {}, result: false, descr: 'Compare null with empty object',
    }, {
        value: {}, expected: null, result: false, descr: 'Compare empty object with null',
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
    }];

    await App.scenario.runner.runGroup(CommonTests.deepMeetTest, data);
};
