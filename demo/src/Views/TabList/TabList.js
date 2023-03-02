import 'jezvejs/style';
import 'jezvejs/style/Button';
import {
    createElement,
    ge,
    onReady,
    setEvents,
} from 'jezvejs';
import { TabList } from 'jezvejs/TabList';
import { initNavigation } from '../../app.js';
import './style.scss';

const addEventLog = (value) => {
    const logElem = ge('eventsLog');
    logElem.value += `${value}\r\n`;
};

const renderContent = (value) => createElement('div', {
    props: {
        textContent: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Impedit aliquam aperiam sapiente libero rerum reiciendis quas est? (${value})`,
    },
});

const renderListItem = (textContent) => createElement('div', {
    props: { textContent },
});

const renderArrayContent = () => Array(5).fill('Item').map((item, index) => renderListItem(`${item} ${index}`));

const getItems = (disableLast = false) => ([{
    id: 1,
    title: 'First',
    value: 1,
    content: renderContent(1),
}, {
    id: 2,
    title: 'Second',
    value: 2,
    content: renderContent(2),
}, {
    id: 'str',
    title: 'Array content',
    value: 'str',
    content: renderArrayContent(),
    disabled: disableLast,
}]);

const initDefault = () => {
    const tabList = TabList.create({
        items: getItems(),
        onChange: (sel) => addEventLog(`Selected: [${sel.id}]`),
    });

    const container = ge('defaultContainer');
    container.append(tabList.elem);
};

const initStyled = () => {
    const tabList = TabList.create({
        className: 'styled',
        items: getItems(),
    });

    const container = ge('styledContainer');
    container.append(tabList.elem);
};

const initDisabledItem = () => {
    const tabList = TabList.create({
        className: 'styled',
        items: getItems(true),
    });

    const container = ge('disabledItemContainer');
    container.append(tabList.elem);

    const btn = ge('toggleEnableItemBtn');
    setEvents(btn, {
        click: () => {
            const item = tabList.getItem('str');
            btn.textContent = (item.disabled) ? 'Disable item' : 'Enable item';
            tabList.enableItem('str', item.disabled);
        },
    });
};

const initDisabled = () => {
    const tabList = TabList.create({
        disabled: true,
        className: 'styled',
        items: getItems(),
    });

    const container = ge('disabledContainer');
    container.append(tabList.elem);

    const btn = ge('toggleEnableBtn');
    setEvents(btn, {
        click: () => {
            const { disabled } = tabList;
            btn.textContent = (disabled) ? 'Disable' : 'Enable';
            tabList.enable(disabled);
        },
    });
};

const init = () => {
    initNavigation();

    initDefault();
    initStyled();
    initDisabledItem();
    initDisabled();
};

onReady(init);
