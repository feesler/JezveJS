import 'jezvejs/style';
import {
    ge,
    isDate,
    isFunction,
    isVisible,
    show,
    onReady,
    createElement,
} from 'jezvejs';
import { initNavigation } from '../../app.js';
import './CommonTestsView.scss';

let restbl = null;
let totalRes = null;
let okRes = null;
let failRes = null;
let results = {};

const addResult = (descr, res, message) => {
    const msg = message || '';

    results.total += 1;
    if (res) {
        results.ok += 1;
    } else {
        results.fail += 1;
    }

    totalRes.textContent = results.total;
    okRes.textContent = results.ok;
    failRes.textContent = results.fail;

    const resultRow = createElement('tr', {
        children: [
            createElement('td', { props: { textContent: descr } }),
            createElement('td', { props: { textContent: (res ? 'OK' : 'FAIL') } }),
            createElement('td', { props: { textContent: msg } }),
        ],
    });

    restbl.append(resultRow);
};

const addBlock = (descr, category) => {
    const blockRow = createElement('tr', {
        props: { className: `res-block-${category}` },
        children: createElement('td', {
            props: { colSpan: 3, textContent: descr },
        }),
    });

    restbl.append(blockRow);
};

// Run action, check state and add result to the list
const test = (descr, action) => {
    let res = false;
    let errorMessage = '';

    try {
        /* eslint-disable-next-line no-console */
        console.log(`Test: ${descr}`);
        res = action();
    } catch (e) {
        errorMessage = e.message;
    }

    addResult(descr, res, errorMessage);
};

/** Type check tests */
const typeCheckTests = () => {
    const testArray = [1, 2, 3, 4];
    const testFunction = () => { };
    const testDate = new Date();

    addBlock('Type check', 2);

    test('isFunction()', () => (
        isFunction(testFunction) && !isFunction(testArray) && !isFunction(testDate)
    ));

    test('isDate()', () => (
        isDate(testDate) && !isDate(testArray) && !isDate(testFunction)
    ));
};

/** DOM tests */
const setEventResult = (text) => {
    const resultElem = ge('evResult');
    if (!resultElem) {
        return;
    }

    resultElem.textContent = text.toString();
};

const domTests = () => {
    addBlock('DOM', 1);

    const view = ge('testview');
    const testDiv = createElement('div', {
        events: {
            click() {
                setEventResult('click');
            },
            mouseover() {
                setEventResult('mouseover');
            },
            mouseout() {
                setEventResult('mouseout');
            },
        },
    });

    view.append(testDiv);
    show(testDiv, false);

    let childDiv = createElement('div', {
        children: [
            createElement('div', { props: { id: 'child1' } }),
            createElement('div', { props: { id: 'child2' } }),
        ],
    });

    testDiv.append(childDiv);
    childDiv = ge('child2');

    test('contains', () => testDiv.contains(childDiv));

    // classList
    addBlock('classList', 2);

    test('classList.contains', () => {
        testDiv.className = 'class1 class2 class3';

        return testDiv.classList.contains('class3')
            && testDiv.classList.contains('class1', 'class2', 'class3');
    });

    test('classList.add', () => {
        testDiv.classList.add('class4', 'class5');
        testDiv.classList.add('class6');

        return testDiv.className === 'class1 class2 class3 class4 class5 class6';
    });

    test('classList.remove', () => {
        testDiv.classList.remove('class1', 'class4');
        testDiv.classList.remove('class6');

        return testDiv.className === 'class2 class3 class5';
    });

    test('isVisible', () => {
        const noRootElem = createElement('div');

        if (!isVisible('visibleElem')) {
            throw new Error('Wrong visibility of visible element');
        }
        if (isVisible('hiddenElem1')) {
            throw new Error('Wrong visibility of hidden element');
        }
        if (isVisible('hiddenElem2', true)) {
            throw new Error('Wrong visibility of element inside of hierarchy of hidden');
        }
        if (isVisible(noRootElem, true)) {
            throw new Error('Wrong visibility of element not attached to document');
        }

        return true;
    });
};

/** Run all remain tests */
const runTests = () => {
    addBlock('Utils', 1);

    addResult('onReady()', true);
    addResult('setTimeout()', true);
    addResult('ge( string )', true);

    typeCheckTests();
    domTests();
};

const onStartClick = () => {
    results = { total: 0, ok: 0, fail: 0 };
    addResult('Test initialization', true);

    setTimeout(runTests);
};

/** Page initialization */
const init = () => {
    initNavigation();

    const startbtn = ge('startbtn');
    totalRes = ge('totalRes');
    okRes = ge('okRes');
    failRes = ge('failRes');
    restbl = ge('restbl');
    if (!startbtn || !totalRes || !okRes || !failRes || !restbl) {
        throw new Error('Fail to init tests');
    }

    startbtn.onclick = onStartClick;
};

onReady(init);
