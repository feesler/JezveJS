import 'jezvejs/style';
import 'jezvejs/style/Button';
import { ge, onReady, setEvents } from 'jezvejs';
import { Checkbox } from 'jezvejs/Checkbox';
import { Radio } from 'jezvejs/Radio';
import { initNavigation } from '../../app.js';
import './style.scss';

const addEventLog = (value) => {
    const logElem = ge('eventsLog');
    logElem.value += `${value}\r\n`;
};

const initParsed = () => {
    Checkbox.fromElement(ge('defaultCheckboxNoLabel'), {
        onChange: (checked) => addEventLog(`Parsed Checkbox change. checked: ${checked}`),
    });
    Checkbox.fromElement(ge('defaultCheckboxLabel'), {
        onChange: (checked) => addEventLog(`Parsed Checkbox with label change. checked: ${checked}`),
    });
    Checkbox.fromElement(ge('circleCheckboxLabel'), {
        onChange: (checked) => addEventLog(`Parsed Checkbox with custom label change. checked: ${checked}`),
    });
};

const initDynamic = () => {
    const dynamicCheckbox = Checkbox.create({
        id: 'dynCheckbox',
        name: 'check1',
        label: 'Checkbox methods',
        onChange: (checked) => addEventLog(`Dynamic Checkbox change. checked: ${checked}`),
    });
    const form = ge('dynamicContainer');
    form.append(dynamicCheckbox.elem);

    setEvents(ge('checkBtn'), { click: () => dynamicCheckbox.check(true) });
    setEvents(ge('uncheckBtn'), { click: () => dynamicCheckbox.check(false) });
    setEvents(ge('toggleBtn'), { click: () => dynamicCheckbox.toggle() });
    setEvents(ge('enableBtn'), { click: () => dynamicCheckbox.enable(true) });
    setEvents(ge('disableBtn'), { click: () => dynamicCheckbox.enable(false) });
    setEvents(ge('changePropBtn'), {
        click: () => {
            dynamicCheckbox.input.checked = false;
        },
    });
    setEvents(ge('resetBtn'), { click: () => form.reset() });
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
    const form = ge('dynamicRadioContainer');

    const dynamicRadio1 = Radio.create({
        id: 'dynRadio',
        name: 'radio2',
        value: '1',
        label: 'Value 1',
        onChange: (checked) => addEventLog(`Dynamic Radio 1 change. checked: ${checked}`),
    });
    const dynamicRadio2 = Radio.create({
        name: 'radio2',
        value: '2',
        label: 'Value 2',
        onChange: (checked) => addEventLog(`Dynamic Radio 2 change. checked: ${checked}`),
    });
    const dynamicRadio3 = Radio.create({
        name: 'radio2',
        value: '2',
        label: 'Value 3',
        onChange: (checked) => addEventLog(`Dynamic Radio 3 change. checked: ${checked}`),
    });
    form.append(dynamicRadio1.elem, dynamicRadio2.elem, dynamicRadio3.elem);

    setEvents(ge('checkRadioBtn'), { click: () => dynamicRadio3.check(true) });
    setEvents(ge('uncheckRadioBtn'), { click: () => dynamicRadio3.check(false) });
    setEvents(ge('toggleRadioBtn'), { click: () => dynamicRadio3.toggle() });
    setEvents(ge('enableRadioBtn'), { click: () => dynamicRadio3.enable(true) });
    setEvents(ge('disableRadioBtn'), { click: () => dynamicRadio3.enable(false) });
    setEvents(ge('changeRadioPropBtn'), {
        click: () => {
            dynamicRadio3.input.checked = false;
        },
    });
    setEvents(ge('resetRadioBtn'), { click: () => form.reset() });
};

const init = () => {
    initNavigation();

    initParsed();
    initDynamic();
    initLarge();
    initParsedRadio();
    initDynamicRadio();
};

onReady(init);
