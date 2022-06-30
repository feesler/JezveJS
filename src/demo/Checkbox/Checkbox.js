import { ce, ge, onReady } from '../../js/common.js';
import { Checkbox } from '../../Components/Checkbox/Checkbox.js';
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

const init = () => {
    initParsed();
    initDynamic();
    initLarge();
};

onReady(init);
