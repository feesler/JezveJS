import {
    baseUrl,
    goTo,
    setBlock,
} from 'jezve-test';
import * as Actions from '../run/TabList.js';

export const tabListTests = async () => {
    const pageUrl = `${baseUrl()}demo/tablist.html`;
    await goTo(pageUrl);

    setBlock('TabList component', 1);
    await Actions.selectTabById('default', '2');
    await Actions.selectTabById('default', 'str');

    await Actions.selectTabById('styled', '2');
    await Actions.selectTabById('styled', '1');

    await Actions.toggleEnableItem();
    await Actions.toggleEnableItem();

    await Actions.toggleEnable();
    await Actions.toggleEnable();
};