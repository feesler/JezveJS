import 'jezvejs/style';
import 'jezvejs/style/Button';
import { ge, setEvents } from 'jezvejs';
import { Switch } from 'jezvejs/Switch';

import { DemoView } from '../../Application/DemoView.js';
import './SwitchView.scss';

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
        className: 'blue-switch',
        onChange: (checked) => addEventLog(`Dynamic Switch change. checked: ${checked}`),
    });
    const form = ge('dynamicContainer');
    form.appendChild(dynamicSwitch.elem);

    setEvents(ge('checkBtn'), { click: () => dynamicSwitch.check(true) });
    setEvents(ge('uncheckBtn'), { click: () => dynamicSwitch.check(false) });
    setEvents(ge('toggleBtn'), { click: () => dynamicSwitch.toggle() });
    setEvents(ge('enableBtn'), { click: () => dynamicSwitch.enable(true) });
    setEvents(ge('disableBtn'), { click: () => dynamicSwitch.enable(false) });
    setEvents(ge('changePropBtn'), {
        click: () => {
            dynamicSwitch.input.checked = false;
        },
    });
    setEvents(ge('resetBtn'), { click: () => form.reset() });
};

const initLarge = () => {
    const largeSwitch = Switch.create({
        className: 'large-switch',
        onChange: (checked) => addEventLog(`Large Switch change. checked: ${checked}`),
    });
    ge('largeContainer').appendChild(largeSwitch.elem);
};

class SwitchView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initTableOfContents();
        this.addTableOfContentsItem({ title: 'Parse component', url: 'parse' });
        this.addTableOfContentsItem({ title: 'Create component', url: 'create' });
        this.addTableOfContentsItem({ title: 'Large', url: 'large' });

        initParsed();
        initDynamic();
        initLarge();
    }
}

SwitchView.create();
