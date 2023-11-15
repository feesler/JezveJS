import {
    baseUrl,
    goTo,
    setBlock,
} from 'jezve-test';
import * as Actions from '../actions/TabList.js';

export const tabListTests = async () => {
    const pageUrl = `${baseUrl()}tablist.html`;
    await goTo(pageUrl);

    setBlock('TabList component', 1);
    await Actions.selectTabById('default', '2');
    await Actions.selectTabById('default', 'str');

    await Actions.selectTabById('styled', '2');
    await Actions.selectTabById('styled', '1');

    await Actions.toggleShowItem();
    await Actions.toggleShowItem();

    await Actions.toggleEnableItem();
    await Actions.toggleEnableItem();

    await Actions.toggleEnable();
    await Actions.toggleEnable();
};
