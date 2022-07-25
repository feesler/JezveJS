import {
    ge,
    ce,
    isDate,
    isFunction,
    isVisible,
    show,
    onReady,
} from '../../js/index.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import './common_test.css';

let restbl = null;
let totalRes = null;
let okRes = null;
let failRes = null;
let results = {};

function addResult(descr, res, message) {
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

    const resultRow = ce(
        'tr',
        {},
        [
            ce('td', { textContent: descr }),
            ce('td', { textContent: (res ? 'OK' : 'FAIL') }),
            ce('td', { textContent: msg }),
        ],
    );

    restbl.appendChild(resultRow);
}

function addBlock(descr, category) {
    const blockRow = ce(
        'tr',
        { className: `res-block-${category}` },
        ce('td', { colSpan: 3, textContent: descr }),
    );

    restbl.appendChild(blockRow);
}

// Run action, check state and add result to the list
function test(descr, action) {
    let res = false;
    let errorMessage = '';

    try {
        console.log(`Test: ${descr}`);
        res = action();
    } catch (e) {
        errorMessage = e.message;
    }

    addResult(descr, res, errorMessage);
}

/** Type check tests */
function typeCheckTests() {
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
}

/** DOM tests */
function setEventResult(text) {
    const resultElem = ge('evResult');
    if (!resultElem) {
        return;
    }

    resultElem.textContent = text.toString();
}

function domTests() {
    addBlock('DOM', 1);

    const view = ge('testview');
    const testDiv = ce('div', null, null, {
        click() {
            setEventResult('click');
        },
        mouseover() {
            setEventResult('mouseover');
        },
        mouseout() {
            setEventResult('mouseout');
        },
    });

    view.appendChild(testDiv);
    show(testDiv, false);

    let childDiv = ce('div', {}, [ce('div', { id: 'child1' }), ce('div', { id: 'child2' })]);

    testDiv.appendChild(childDiv);
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
        const noRootElem = ce('div');

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
}

/** Run all remain tests */
function runTests() {
    addBlock('Utils', 1);

    addResult('onReady()', true);
    addResult('setTimeout()', true);
    addResult('ge( string )', true);

    typeCheckTests();
    domTests();
}

function onStartClick() {
    results = { total: 0, ok: 0, fail: 0 };
    addResult('Test initialization', true);

    setTimeout(runTests);
}

/** Page initialization */
function init() {
    const startbtn = ge('startbtn');
    totalRes = ge('totalRes');
    okRes = ge('okRes');
    failRes = ge('failRes');
    restbl = ge('restbl');
    if (!startbtn || !totalRes || !okRes || !failRes || !restbl) {
        throw new Error('Fail to init tests');
    }

    startbtn.onclick = onStartClick;
}

onReady(init);
