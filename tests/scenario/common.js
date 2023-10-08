import { setBlock } from 'jezve-test';
import * as Actions from '../actions/common.js';
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

    await App.scenario.runner.runGroup(Actions.deepMeetTest, data);
};

const minMaxTests = async () => {
    setBlock('minmax() function', 1);

    setBlock('Integer values', 2);
    await Actions.minMaxTest(1, 10, 5, 5);
    await Actions.minMaxTest(1, 10, 15, 10);
    await Actions.minMaxTest(1, 10, 0, 1);
    await Actions.minMaxTest(1, 10, -5, 1);

    setBlock('Float values', 2);
    await Actions.minMaxTest(-15.5, 15.5, 5.5, 5.5);
    await Actions.minMaxTest(-15.5, 15.5, 15.6, 15.5);
    await Actions.minMaxTest(-15.5, 15.5, 0, 0);
    await Actions.minMaxTest(-15.5, 15.5, -15.55, -15.5);

    setBlock('Inverted range arguments', 2);
    await Actions.minMaxTest(20, 10, 15, 15);
    await Actions.minMaxTest(-10, -20, 15, -10);

    setBlock('Same range arguments', 2);
    await Actions.minMaxTest(10, 10, 15, 10);
    await Actions.minMaxTest(10, 10, -15, 10);
    await Actions.minMaxTest(10, 10, 10, 10);
    await Actions.minMaxTest(-10, -10, 15, -10);
    await Actions.minMaxTest(-10, -10, 0, -10);
    await Actions.minMaxTest(-10, -10, -10, -10);

    setBlock('Invalid arguments', 2);
    await Actions.minMaxTest(null, -10, 1, 0);
    await Actions.minMaxTest(undefined, 1, 5, NaN);
    await Actions.minMaxTest(NaN, null, undefined, NaN);
    await Actions.minMaxTest({}, null, 5, NaN);
    await Actions.minMaxTest(() => { }, null, 5, NaN);
    await Actions.minMaxTest(1, 10, NaN, NaN);
};

const fixFloatTests = async () => {
    setBlock('fixFloat', 1);

    setBlock('Number values', 2);
    await Actions.fixFloatTest('Integer number', 100, '100');
    await Actions.fixFloatTest('Float number', 100.5, '100.5');

    setBlock('Invalid values', 2);
    await Actions.fixFloatTest('null value', null, null);
    await Actions.fixFloatTest('undefined value', undefined, null);
    await Actions.fixFloatTest('NaN value', NaN, null);

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
        Actions.fixFloatTest(`Zero string '${value}'`, value, expected)
    ), zeroPairs);

    setBlock('Negative zero strings', 2);
    await App.scenario.runner.runGroup(([value, expected]) => (
        Actions.fixFloatTest(`Negative zero string '${value}'`, value, expected)
    ), negZeroPairs);

    setBlock('Strings', 2);
    await Actions.fixFloatTest('Empty string', '', '0');
    await Actions.fixFloatTest('Integer number string', '123', '123');
    await Actions.fixFloatTest('Float number string with point', '123.5', '123.5');
    await Actions.fixFloatTest('Float number string with comma', '123,5', '123.5');
    await Actions.fixFloatTest('Float number string starts with point', '.56', '0.56');
    await Actions.fixFloatTest('Float number string starts with comma', ',56', '0.56');
};

const trimDecimalTests = async () => {
    setBlock('trimDecimalPlaces() function', 1);

    await Actions.trimDecimalTest('10.12345', 7, '10.12345');
    await Actions.trimDecimalTest('10.12345', 6, '10.12345');
    await Actions.trimDecimalTest('10.12345', 5, '10.12345');
    await Actions.trimDecimalTest('10.12345', 4, '10.1234');
    await Actions.trimDecimalTest('10.12345', 3, '10.123');
    await Actions.trimDecimalTest('10.12345', 2, '10.12');
    await Actions.trimDecimalTest('10.12345', 1, '10.1');
    await Actions.trimDecimalTest('10.12345', 0, '10');
    await Actions.trimDecimalTest('-10.12345', 7, '-10.12345');
    await Actions.trimDecimalTest('-10.12345', 6, '-10.12345');
    await Actions.trimDecimalTest('-10.12345', 5, '-10.12345');
    await Actions.trimDecimalTest('-10.12345', 4, '-10.1234');
    await Actions.trimDecimalTest('-10.12345', 3, '-10.123');
    await Actions.trimDecimalTest('-10.12345', 2, '-10.12');
    await Actions.trimDecimalTest('-10.12345', 1, '-10.1');
    await Actions.trimDecimalTest('-10.12345', 0, '-10');
};

const colorToIntTests = async () => {
    setBlock('colorToInt() function', 1);

    await Actions.colorToIntTest('#ffffff', 0xffffff);
    await Actions.colorToIntTest('#000000', 0x000000);
    await Actions.colorToIntTest('#123abc', 0x123abc);
    await Actions.colorToIntTest('#1', 0x000001);
    await Actions.colorToIntTest('123456', 0x123456);
    await Actions.colorToIntTest(123456, 123456);
    await Actions.colorToIntTest(0x8ffffff, 0xffffff);
    await Actions.colorToIntTest('', 0);
    await Actions.colorToIntTest(null, 0);
    await Actions.colorToIntTest(NaN, 0);
};

const intToColorTests = async () => {
    setBlock('intToColor() function', 1);

    await Actions.intToColorTest(0xffffff, '#ffffff');
    await Actions.intToColorTest(0x000000, '#000000');
    await Actions.intToColorTest(0x123abc, '#123abc');
    await Actions.intToColorTest(0x000001, '#000001');
};

const rgbToHSLTests = async () => {
    setBlock('rgbToHSL() function', 1);

    await Actions.rgbToHSLTest(
        0xffffff,
        { hue: 0, saturation: 0, lightness: 100 },
    );
    await Actions.rgbToHSLTest(
        '#000000',
        { hue: 0, saturation: 0, lightness: 0 },
    );
    await Actions.rgbToHSLTest(
        '#ff0000',
        { hue: 0, saturation: 100, lightness: 50 },
    );
    await Actions.rgbToHSLTest(
        '#00ff00',
        { hue: 120, saturation: 100, lightness: 50 },
    );
    await Actions.rgbToHSLTest(
        '#0000ff',
        { hue: 240, saturation: 100, lightness: 50 },
    );
};

const hslToRGBTests = async () => {
    setBlock('hslToRGB() function', 1);

    await Actions.hslToRGBTest(
        { hue: 0, saturation: 0, lightness: 100 },
        { red: 255, green: 255, blue: 255 },
    );
    await Actions.hslToRGBTest(
        { hue: 0, saturation: 0, lightness: 0 },
        { red: 0, green: 0, blue: 0 },
    );
    await Actions.hslToRGBTest(
        { hue: 0, saturation: 100, lightness: 50 },
        { red: 255, green: 0, blue: 0 },
    );
    await Actions.hslToRGBTest(
        { hue: 120, saturation: 100, lightness: 50 },
        { red: 0, green: 255, blue: 0 },
    );
    await Actions.hslToRGBTest(
        { hue: 240, saturation: 100, lightness: 50 },
        { red: 0, green: 0, blue: 255 },
    );
};

const colorTests = async () => {
    setBlock('Color functions', 1);

    await colorToIntTests();
    await intToColorTests();
    await rgbToHSLTests();
    await hslToRGBTests();
};

export const commonTests = async () => {
    setBlock('Common', 1);

    await deepMeetTests();
    await minMaxTests();
    await fixFloatTests();
    await trimDecimalTests();
    await colorTests();
};
