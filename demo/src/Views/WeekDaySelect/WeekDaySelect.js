import 'jezvejs/style';
import 'jezvejs/style/Button';
import { ge, setEvents } from 'jezvejs';
import { WeekDaySelect } from 'jezvejs/WeekDaySelect';

import { DemoView } from '../../Application/DemoView.js';
import './WeekDaySelectView.scss';

const addEventLog = (value) => {
    const logElem = ge('eventsLog');
    logElem.value += `${value}\r\n`;
};

const initDefault = () => {
    const select = WeekDaySelect.create({
        onChange: (sel) => addEventLog(`Selected: [${sel}]`),
    });

    const container = ge('defaultContainer');
    container.append(select.elem);
};

const initStyled = () => {
    const select = WeekDaySelect.create({
        className: 'styled bold',
    });

    const container = ge('styledContainer');
    container.append(select.elem);
};

const initMultiSelect = () => {
    const select = WeekDaySelect.create({
        className: 'styled bold',
        multiple: true,
        type: 'buttons',
    });
    select.setSelection(['1', '2']);

    const container = ge('multiSelectContainer');
    container.append(select.elem);
};

const initLocale = () => {
    const enSelect = WeekDaySelect.create({
        locales: 'en-US',
    });
    ge('enLocale').append(enSelect.elem);

    const frSelect = WeekDaySelect.create({
        locales: 'fr',
    });
    ge('frLocale').append(frSelect.elem);

    const ruSelect = WeekDaySelect.create({
        locales: 'ru',
    });
    ge('ruLocale').append(ruSelect.elem);
};

const initDisabledItem = () => {
    const select = WeekDaySelect.create({
        className: 'styled',
    });
    select.enableItem('2', false);

    const container = ge('disabledItemContainer');
    container.append(select.elem);

    const btn = ge('toggleEnableItemBtn');
    setEvents(btn, {
        click: () => {
            const item = select.getItemByValue('2');
            select.enableItem('2', item?.disabled);
        },
    });
};

const initDisabled = () => {
    const select = WeekDaySelect.create({
        disabled: true,
        className: 'styled',
    });

    const container = ge('disabledContainer');
    container.append(select.elem);

    const btn = ge('toggleEnableBtn');
    setEvents(btn, {
        click: () => {
            const { disabled } = select;
            btn.textContent = (disabled) ? 'Disable' : 'Enable';
            select.enable(disabled);
        },
    });
};

class WeekDaySelectView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.addContentsMenuItem({ title: 'Default settings', url: 'default' });
        this.addContentsMenuItem({ title: 'Styled', url: 'styled' });
        this.addContentsMenuItem({ title: 'Multiple select', url: 'multiSelect' });
        this.addContentsMenuItem({ title: 'Locales', url: 'locales' });
        this.addContentsMenuItem({ title: 'Disabled item', url: 'disabledItem' });
        this.addContentsMenuItem({ title: 'Disabled component', url: 'disabled' });

        initDefault();
        initStyled();
        initMultiSelect();
        initLocale();
        initDisabledItem();
        initDisabled();
    }
}

WeekDaySelectView.create();
