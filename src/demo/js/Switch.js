import { ge, onReady } from '../../js/common.js';
import { Switch } from '../../Components/Switch/Switch.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import '../css/switch.css';

const addEventLog = (value) => {
    const logElem = ge('eventsLog');
    logElem.value += `${value}\r\n`;
};

const initParsed = () => {
    Switch.fromElement(ge('defaultSwitch'), {
        onChange: (checked) => addEventLog(`Parsed Switch change. checked: ${checked}`),
    });
};

const initDynamic = () => {
    const dynamicSwitch = Switch.create({
        className: 'gray-switch',
        onChange: (checked) => addEventLog(`Dynamic Switch change. checked: ${checked}`),
    });
    ge('dynamicContainer').appendChild(dynamicSwitch.elem);

    ge('checkBtn').addEventListener('click', () => dynamicSwitch.check(true));
    ge('uncheckBtn').addEventListener('click', () => dynamicSwitch.check(false));
    ge('toggleBtn').addEventListener('click', () => dynamicSwitch.toggle());
    ge('enableBtn').addEventListener('click', () => dynamicSwitch.enable(true));
    ge('disableBtn').addEventListener('click', () => dynamicSwitch.enable(false));
};

const initLarge = () => {
    const largeSwitch = Switch.create({
        className: 'large-switch',
        onChange: (checked) => addEventLog(`Large Switch change. checked: ${checked}`),
    });
    ge('largeContainer').appendChild(largeSwitch.elem);
};

const init = () => {
    initParsed();
    initDynamic();
    initLarge();
};

onReady(init);
