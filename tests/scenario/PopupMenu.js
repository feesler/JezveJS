import {
    baseUrl,
    goTo,
    setBlock,
} from 'jezve-test';
import * as Actions from '../actions/PopupMenu.js';

export const popupMenuTests = async () => {
    const pageUrl = `${baseUrl()}demo/popupmenu.html`;
    await goTo(pageUrl);

    setBlock('PopupMenu component', 1);
    await Actions.toggleDefault();
    await Actions.toggleDefault();
    await Actions.toggleAbsPosition();
    await Actions.toggleClipping();
    await Actions.toggleListMenu(0);
    await Actions.toggleListMenu(4);
    await Actions.toggleListMenu(4);
};
