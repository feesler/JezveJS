import {
    test,
    assert,
    baseUrl,
    goTo,
    setBlock,
    isVisible,
} from 'jezve-test';
import * as Actions from '../actions/DropDown.js';
import { App } from '../app.js';

export const dropDownTests = async () => {
    const pageUrl = `${baseUrl()}demo/dropdown.html`;
    await goTo(pageUrl);

    setBlock('Drop Down component', 1);

    setBlock('Single item select', 2);

    await Actions.selectTest('inlineDropDown', '2');
    await Actions.selectTest('editableInlineDropDown', '3');
    await Actions.selectTest('fullWidthDropDown', '1');
    await Actions.selectTest('halfWidthDropDown', '2');

    await test('Parse select',
        () => App.view.content.parsedSelDropDown.textValue === 'Item 1');

    await Actions.selectTest('parsedSelDropDown', '3');
    await test('Selected value update',
        () => App.view.content.parsedSelDropDown.textValue === 'Item 3');

    await test('Parse select with selected option',
        () => App.view.content.parsedSelSelectedDropDown.textValue === 'Item 3');
    await Actions.selectTest('parsedSelDropDown', '5');

    await test('Attached to block element', () => (
        !App.view.content.attachedToBlockDropDown.listContainer?.visible
    ));
    await Actions.selectTest('attachedToBlockDropDown', '2');

    await test('Attached to inline element',
        async () => !(await isVisible(
            App.view.content.attachedToInlineDropDown.content.listContainer, true,
        )));
    await Actions.selectTest('attachedToInlineDropDown', '3');

    setBlock('Multiple items select', 2);

    const expectedSelectedItems = [
        { id: '1', title: 'Item 1' },
        { id: '2', title: 'Item 2' },
        { id: '3', title: 'Item 3' },
    ];

    await test('Multi select Drop Down',
        () => App.view.content.multiSelDropDown.multiple
            && assert.deepMeet(
                App.view.content.multiSelDropDown.content.selectedItems,
                expectedSelectedItems,
            ));
    await Actions.selectTest('multiSelDropDown', '3');
    await Actions.selectTest('multiSelDropDown', '5');

    await test('List of multi select Drop Down not closed after click by item',
        () => (isVisible(
            App.view.content.multiSelDropDown.content.listContainer, true,
        )));

    await Actions.deselectTest('multiSelDropDown', '5');
    await Actions.clearTest('multiSelDropDown');

    setBlock('Filter items', 2);

    await Actions.toggleEnableFilter();
    await Actions.filterTest('filterDropDown', '1');
    await Actions.filterTest('filterDropDown', '10');
    await Actions.filterTest('filterDropDown', '100');

    await Actions.toggleEnableMultiFilter();
    await Actions.filterTest('multiFilterDropDown', '1');
    await Actions.filterTest('multiFilterDropDown', '10');
    await Actions.filterTest('multiFilterDropDown', '100');

    await Actions.filterTest('groupsFilterDropDown', '1');
    await Actions.filterTest('groupsFilterDropDown', '10');
    await Actions.filterTest('groupsFilterDropDown', '100');

    setBlock('Component methods', 2);

    await Actions.addRemoveItemsTest();
};
