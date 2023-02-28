import 'jezvejs/style';
import 'jezvejs/style/Button';
import {
    createElement,
    ge,
    onReady,
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

const getItems = () => ([{
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

const init = () => {
    initNavigation();

    initDefault();
    initStyled();
};

onReady(init);
