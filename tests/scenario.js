import {
    test,
    assert,
    Runner,
    baseUrl,
    goTo,
    setBlock,
    isVisible,
} from 'jezve-test';
import * as DropDownTests from './run/DropDown.js';
import * as DatePickerTests from './run/DatePicker.js';
import * as PaginatorTests from './run/Paginator.js';
import { App } from './app.js';

export class Scenario {
    constructor(environment) {
        this.environment = environment;
    }

    static async create(environment) {
        const instance = new this(environment);
        await instance.init();
        return instance;
    }

    async init() {
        // Setup test runner
        this.runner = new Runner();
    }

    async run() {
        this.fullTest = true;

        if (this.fullTest) {
            await this.runFullScenario();
        } else {
            await this.runTestScenario();
        }
    }

    /* eslint-disable no-empty-function */
    async runTestScenario() {
    }
    /* eslint-enable no-empty-function */

    async runFullScenario() {
        await this.dropDownTests();
        await this.datePickerTests();
        await this.paginatorTests();
    }

    async dropDownTests() {
        const pageUrl = `${baseUrl()}demo/dropdown.html`;
        await goTo(pageUrl);

        setBlock('Drop Down component', 1);

        await DropDownTests.selectTest('inlineDropDown', '2');
        await DropDownTests.selectTest('editableInlineDropDown', '3');
        await DropDownTests.selectTest('fullWidthDropDown', '1');
        await DropDownTests.selectTest('halfWidthDropDown', '2');

        await test('Parse select',
            () => App.view.content.parsedSelDropDown.textValue === 'Item 1');

        await DropDownTests.selectTest('parsedSelDropDown', '3');
        await test('Selected value update',
            () => App.view.content.parsedSelDropDown.textValue === 'Item 3');

        await test('Parse select with selected option',
            () => App.view.content.parsedSelSelectedDropDown.textValue === 'Item 3');
        await DropDownTests.selectTest('parsedSelDropDown', '5');

        await test('Attached to block element', () => (
            !App.view.content.attachedToBlockDropDown.listContainer?.visible
        ));
        await DropDownTests.selectTest('attachedToBlockDropDown', '2');

        await test('Attached to inline element',
            async () => !(await isVisible(
                App.view.content.attachedToInlineDropDown.content.listContainer, true,
            )));
        await DropDownTests.selectTest('attachedToInlineDropDown', '3');

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
        await DropDownTests.selectTest('multiSelDropDown', '3');
        await DropDownTests.selectTest('multiSelDropDown', '5');

        await test('List of multi select Drop Down not closed after click by item',
            () => (isVisible(
                App.view.content.multiSelDropDown.content.listContainer, true,
            )));

        await DropDownTests.deselectTest('multiSelDropDown', '5');

        await DropDownTests.addRemoveItemsTest();
    }

    async datePickerTests() {
        const pageUrl = `${baseUrl()}demo/datepicker.html`;
        await goTo(pageUrl);

        setBlock('Date Picker component', 1);

        setBlock('Static Date Picker', 2);
        await DatePickerTests.selectDateStatic(App.dates.yesterday);
        await DatePickerTests.selectDateStatic(App.dates.weekAgo);
        await DatePickerTests.selectDateStatic(App.dates.weekAfter);
        await DatePickerTests.selectDateStatic(App.dates.monthAgo);
        await DatePickerTests.selectDateStatic(App.dates.yearAgo);

        setBlock('Popup Date Picker', 2);
        await DatePickerTests.selectDatePopup(App.dates.yesterday);
        await DatePickerTests.selectDatePopup(App.dates.monthAgo);

        setBlock('Range select', 2);
        await DatePickerTests.selectDateRange({
            start: App.dates.monthAgo,
            end: App.dates.weekAfter,
        });

        setBlock('Callbacks', 2);
        await DatePickerTests.testCallbacks({
            start: App.dates.monthAgo,
            end: App.dates.yearAgo,
        });

        setBlock('setSelection() method', 2);
        await DatePickerTests.testSetSelection();
    }

    async paginatorTests() {
        const pageUrl = `${baseUrl()}demo/paginator.html`;
        await goTo(pageUrl);

        setBlock('Paginator component', 1);
        await PaginatorTests.goToNextPage('styledPaginator');
        await PaginatorTests.goToPrevPage('styledPaginator');
        await PaginatorTests.goToLastPage('styledPaginator');
        await PaginatorTests.goToFirstPage('styledPaginator');

        await PaginatorTests.goToNextPage('handlerPaginator');
        await PaginatorTests.goToLastPage('handlerPaginator');
    }
}
