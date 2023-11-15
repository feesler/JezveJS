import {
    baseUrl,
    goTo,
    setBlock,
} from 'jezve-test';
import * as Actions from '../actions/PopupMenu.js';

export const popupMenuTests = async () => {
    const pageUrl = `${baseUrl()}popupmenu.html`;
    await goTo(pageUrl);

    setBlock('PopupMenu component', 1);

    setBlock('Default settings', 1);
    await Actions.toggleDefault();
    await Actions.toggleDefault();
    await Actions.selectItemByIndex('default', 0);
    await Actions.selectItemByIndex('default', 1);
    await Actions.selectItemByIndex('default', 2);

    setBlock('\'toggleOnClick\' option', 1);
    await Actions.openToggleOnClick();
    await Actions.openToggleOnClick();
    await Actions.closeToggleOnClick();
    await Actions.selectItemByIndex('toggleOnClick', 0);

    setBlock('\'hideOnSelect\' option', 1);
    await Actions.toggleHideOnSelect();
    await Actions.toggleHideOnSelect();
    await Actions.selectItemByIndex('hideOnSelect', 0);
    await Actions.selectItemByIndex('hideOnSelect', 1);

    setBlock('Absolutely positioned menu', 1);
    await Actions.toggleAbsPosition();
    await Actions.selectItemById('absPosition', 'selectAllBtn');

    setBlock('Clipped menu', 1);
    await Actions.toggleClipping();

    setBlock('List menu', 1);
    await Actions.toggleListMenu(0);
    await Actions.toggleListMenu(4);
    await Actions.toggleListMenu(4);
    await Actions.selectItemById('list', 'selectAllBtn', 1);
};
