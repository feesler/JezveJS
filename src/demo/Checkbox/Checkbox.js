import {
    ce,
    ge,
    onReady,
    Checkbox,
    Radio,
} from '../../js/index.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import './checkbox.css';

const addEventLog = (value) => {
    const logElem = ge('eventsLog');
    logElem.value += `${value}\r\n`;
};

const initParsed = () => {
    Checkbox.fromElement(ge('defaultCheckbox'), {
        onChange: (checked) => addEventLog(`Parsed Checkbox change. checked: ${checked}`),
    });
};

const initDynamic = () => {
    const dynamicCheckbox = Checkbox.create({
        className: 'checkbox-circle',
        onChange: (checked) => addEventLog(`Dynamic Checkbox change. checked: ${checked}`),
        label: ce('a', { href: '#', textContent: 'Custom label content' }),
    });
    ge('dynamicContainer').appendChild(dynamicCheckbox.elem);

    ge('checkBtn').addEventListener('click', () => dynamicCheckbox.check(true));
    ge('uncheckBtn').addEventListener('click', () => dynamicCheckbox.check(false));
    ge('toggleBtn').addEventListener('click', () => dynamicCheckbox.toggle());
    ge('enableBtn').addEventListener('click', () => dynamicCheckbox.enable(true));
    ge('disableBtn').addEventListener('click', () => dynamicCheckbox.enable(false));
};

const initLarge = () => {
    const largeCheckbox = Checkbox.create({
        className: 'checkbox-large',
        onChange: (checked) => addEventLog(`Large Checkbox change. checked: ${checked}`),
    });
    ge('largeContainer').appendChild(largeCheckbox.elem);
};

const initParsedRadio = () => {
    Radio.fromElement(ge('defaultRadio1'), {
        onChange: (checked) => addEventLog(`Parsed Radio 1 change. checked: ${checked}`),
    });
    Radio.fromElement(ge('defaultRadio2'), {
        onChange: (checked) => addEventLog(`Parsed Radio 2 change. checked: ${checked}`),
    });
    Radio.fromElement(ge('defaultRadio3'), {
        onChange: (checked) => addEventLog(`Parsed Radio 3 change. checked: ${checked}`),
    });
    Radio.fromElement(ge('defaultRadio4'), {
        onChange: (checked) => addEventLog(`Parsed Radio 4 change. checked: ${checked}`),
    });
};

const initDynamicRadio = () => {
    const container = ge('dynamicRadioContainer');

    const dynamicRadio1 = Radio.create({
        name: 'radio2',
        label: 'Value 1',
        onChange: (checked) => addEventLog(`Dynamic Radio 1 change. checked: ${checked}`),
    });
    const dynamicRadio2 = Radio.create({
        name: 'radio2',
        label: 'Value 2',
        onChange: (checked) => addEventLog(`Dynamic Radio 2 change. checked: ${checked}`),
    });
    const dynamicRadio3 = Radio.create({
        name: 'radio2',
        label: 'Value 3',
        onChange: (checked) => addEventLog(`Dynamic Radio 3 change. checked: ${checked}`),
    });
    container.append(dynamicRadio1.elem, dynamicRadio2.elem, dynamicRadio3.elem);

    ge('checkRadioBtn').addEventListener('click', () => dynamicRadio3.check(true));
    ge('uncheckRadioBtn').addEventListener('click', () => dynamicRadio3.check(false));
    ge('enableRadioBtn').addEventListener('click', () => dynamicRadio3.enable(true));
    ge('disableRadioBtn').addEventListener('click', () => dynamicRadio3.enable(false));
};

const init = () => {
    initParsed();
    initDynamic();
    initLarge();
    initParsedRadio();
    initDynamicRadio();
};

onReady(init);
