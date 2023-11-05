import 'jezvejs/style';
import { asArray } from '@jezvejs/types';
import {
    formatDate,
    parseDateString,
} from '@jezvejs/datetime';
import {
    ge,
    createElement,
} from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';
import { DatePicker } from 'jezvejs/DatePicker';
import { Input } from 'jezvejs/Input';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { createButtons } from '../../Application/utils.js';
import { DateInputGroup } from './components/DateInputGroup/DateInputGroup.js';
import { DateRangeInputGroup } from './components/DateRangeInputGroup/DateRangeInputGroup.js';
import { LocalesContainer } from '../../Components/LocalesContainer/LocalesContainer.js';
import './DatePickerView.scss';

const formatDateToInput = (date, inputId) => {
    const input = ge(inputId);
    if (input) {
        input.value = formatDate(date);
    }
};

const formatMonthToInput = (date, inputId) => {
    const input = ge(inputId);
    if (input) {
        input.value = formatDate(date, {
            locales: ['en'],
            options: { month: 'long', year: 'numeric' },
        });
    }
};

const formatYearToInput = (date, inputId) => {
    const input = ge(inputId);
    if (input) {
        input.value = formatDate(date, {
            locales: ['en'],
            options: { year: 'numeric' },
        });
    }
};

const parseDateFromInput = (inputId) => {
    const input = ge(inputId);
    return parseDateString(input?.value);
};

const formatRangeToInput = (range, inputId) => {
    const input = ge(inputId);
    if (input) {
        const startFmt = formatDate(range.start);
        const endFmt = formatDate(range.end);
        input.value = `${startFmt} - ${endFmt}`;
    }
};

const inDateRange = (date, { start = null, end = null }) => (
    ((start === null) || (date - start >= 0))
    && ((end === null) || (date - end <= 0))
);

const enabledRange = {
    start: new Date(Date.UTC(2010, 1, 8)),
    end: new Date(Date.UTC(2010, 1, 12)),
};
const disabledOutsideRange = (date) => !inDateRange(date, enabledRange);

/**
 * DatePicker component demo view
 */
class DatePickerView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initStatic();
        this.initFillWidth();
        this.initPopup();
        this.initPosition();
        this.initMultiple();
        this.initRangeSelect();
        this.initDoubleView();
        this.initCallbacks();
        this.initSetSelection();
        this.initDisabledDate();
        this.initRangePart();
        this.initMonthSelect();
        this.initYearSelect();
        this.initFirstDay();
        this.initLocales();
    }

    initStatic() {
        const id = 'staticDateInp';
        this.addSection({
            id: 'static',
            title: 'Animated static component',
            content: [
                Input.create({ id }).elem,
                DatePicker.create({
                    static: true,
                    animated: true,
                    onDateSelect: (date) => formatDateToInput(date, id),
                }).elem,
            ],
        });
    }

    initFillWidth() {
        const id = 'fillWidthDateInp';
        this.addSection({
            id: 'fullwidth',
            title: 'Fill parent width',
            content: createElement('div', {
                props: { className: 'width-container' },
                children: [
                    Input.create({ id }).elem,
                    DatePicker.create({
                        static: true,
                        animated: true,
                        className: 'dp_full-width',
                        onDateSelect: (date) => formatDateToInput(date, id),
                    }).elem,
                ],
            }),
        });
    }

    initPopup() {
        const id = 'popupDateInp';
        let datePicker = null;

        const inpGroup = DateInputGroup.create({
            id: 'dpPopupGroup',
            inputId: id,
            buttonId: 'showPopupBtn',
            onButtonClick: () => datePicker?.show(),
        });

        datePicker = DatePicker.create({
            relparent: inpGroup.elem,
            onDateSelect: (date) => {
                formatDateToInput(date, id);
                datePicker.hide();
            },
        });

        this.addSection({
            id: 'popup',
            title: 'Popup component',
            content: [
                inpGroup.elem,
                datePicker.elem,
            ],
        });
    }

    initPosition() {
        let datePicker = null;
        const btn = Button.create({
            id: 'showPosBtn',
            className: 'action-btn',
            title: 'Show',
            onClick: () => datePicker.show(),
        });
        datePicker = DatePicker.create({
            relparent: btn.elem,
        });

        this.addSection({
            id: 'position',
            title: 'Position',
            content: createElement('div', {
                props: { className: 'right-container' },
                children: [
                    btn.elem,
                    datePicker.elem,
                ],
            }),
        });
    }

    initMultiple() {
        const inputId = 'multipleInp';
        let datePicker = null;
        const inpGroup = DateInputGroup.create({
            id: 'dpMultipleGroup',
            inputId,
            buttonId: 'showMultipleBtn',
            onButtonClick: () => datePicker.show(),
        });

        datePicker = DatePicker.create({
            relparent: inpGroup.elem,
            multiple: true,
            onDateSelect: (dates) => {
                const inputEl = document.getElementById(inputId);
                inputEl.value = asArray(dates).map((date) => formatDate(date)).join(' ');
            },
        });

        this.addSection({
            id: 'multiple',
            title: 'Select multiple dates',
            content: [
                inpGroup.elem,
                datePicker.elem,
            ],
        });
    }

    initRangeSelect() {
        let datePicker = null;
        const inpGroup = DateInputGroup.create({
            id: 'dpRangeGroup',
            inputId: 'rangeInp',
            buttonId: 'showRangeBtn',
            onButtonClick: () => datePicker.show(),
        });

        datePicker = DatePicker.create({
            relparent: inpGroup.elem,
            range: true,
            onRangeSelect: (range) => {
                formatRangeToInput(range, 'rangeInp');
                datePicker.hide();
            },
        });

        this.addSection({
            id: 'range',
            title: 'Range select',
            content: [
                inpGroup.elem,
                datePicker.elem,
            ],
        });
    }

    initDoubleView() {
        let datePicker = null;
        const inpGroup = DateInputGroup.create({
            id: 'dpDoubleViewGroup',
            inputId: 'doubleViewInp',
            buttonId: 'showDoubleViewBtn',
            onButtonClick: () => datePicker.show(),
        });

        datePicker = DatePicker.create({
            relparent: inpGroup.elem,
            range: true,
            doubleView: true,
            animated: true,
            onRangeSelect: (range) => {
                formatRangeToInput(range, 'doubleViewInp');
                datePicker.hide();
            },
        });

        this.addSection({
            id: 'doubleView',
            title: '\'doubleView\' option',
            content: [
                inpGroup.elem,
                datePicker.elem,
            ],
        });
    }

    initCallbacks() {
        let datePicker = null;
        const inpGroup = DateInputGroup.create({
            id: 'dpCallbacksGroup',
            inputId: 'cbInp',
            buttonId: 'showCbBtn',
            onButtonClick: () => datePicker.show(!datePicker.visible()),
        });

        const cbStatusText = createElement('span', {
            props: { id: 'cbStatusText', textContent: 'Waiting' },
        });

        datePicker = DatePicker.create({
            relparent: inpGroup.elem,
            range: true,
            onDateSelect: (date) => {
                cbStatusText.textContent = `Date selected: ${formatDate(date)}`;
            },
            onRangeSelect: (range) => formatRangeToInput(range, 'cbInp'),
            onShow: () => {
                cbStatusText.textContent = 'Select range...';
            },
            onHide: () => {
                cbStatusText.textContent = 'Loading...';
            },
        });

        this.addSection({
            id: 'callbacks',
            title: 'Callbacks',
            content: [
                createElement('div', { children: cbStatusText }),
                inpGroup.elem,
                datePicker.elem,
            ],
        });
    }

    initSetSelection() {
        let datePicker = null;
        const inpGroup = DateInputGroup.create({
            id: 'dpSelectionGroup',
            inputId: 'setSelInp',
            buttonId: 'showSelectionBtn',
            onButtonClick: () => datePicker?.show(),
        });

        datePicker = DatePicker.create({
            relparent: inpGroup.elem,
            range: true,
        });
        datePicker.setSelection(
            new Date(Date.UTC(2020, 11, 1)),
            new Date(Date.UTC(2020, 11, 7)),
        );

        const controls = [{
            id: 'setSelectionBtn',
            title: 'Select',
            onClick: () => datePicker.setSelection(
                new Date(Date.UTC(2020, 11, 8)),
                new Date(Date.UTC(2020, 11, 14)),
            ),
        }, {
            id: 'clearSelectionBtn',
            title: 'Clear',
            onClick: () => datePicker.clearSelection(),
        }];

        this.addSection({
            id: 'setSelection',
            title: 'setSelection() method',
            content: [
                inpGroup.elem,
                datePicker.elem,
                createButtons(controls),
            ],
        });
    }

    initDisabledDate() {
        let datePicker = null;
        const inpGroup = DateInputGroup.create({
            id: 'dpDisabledDateGroup',
            inputId: 'disabledDateInp',
            buttonId: 'showDisabledDateBtn',
            onButtonClick: () => datePicker?.show(),
        });

        datePicker = DatePicker.create({
            relparent: inpGroup.elem,
            range: true,
            disabledDateFilter: disabledOutsideRange,
            onDateSelect: (date) => {
                formatDateToInput(date, 'disabledDateInp');
                datePicker.hide();
            },
        });
        datePicker.setSelection(new Date(Date.UTC(2010, 1, 10)));

        const controls = [{
            id: 'setDisabledBtn',
            title: 'Set disabled days',
            onClick: () => datePicker.setDisabledDateFilter(disabledOutsideRange),
        }, {
            id: 'clearDisabledBtn',
            title: 'Clear disabled days',
            onClick: () => datePicker.setDisabledDateFilter(null),
        }];

        this.addSection({
            id: 'disabledDate',
            title: 'disabledDate option',
            content: [
                inpGroup.elem,
                datePicker.elem,
                createButtons(controls),
            ],
        });
    }

    initRangePart() {
        let datePicker = null;
        const inpGroup = DateRangeInputGroup.create({
            id: 'dpRangePartGroup',
            startInputId: 'startDateInp',
            endInputId: 'endDateInp',
            startButtonId: 'selectStartDateBtn',
            endButtonId: 'selectEndDateBtn',
            onStartButtonClick: () => {
                datePicker.setRangePart('start');
                datePicker.show();
            },
            onEndButtonClick: () => {
                datePicker.setRangePart('end');
                datePicker.show();
            },
        });

        datePicker = DatePicker.create({
            relparent: inpGroup.elem,
            disabledDateFilter: (date, state) => {
                const rangePart = state?.rangePart;
                if (rangePart !== 'start' && rangePart !== 'end') {
                    return false;
                }

                const limitInput = (rangePart === 'start') ? 'endDateInp' : 'startDateInp';
                const limitDate = parseDateFromInput(limitInput);
                if (!limitDate) {
                    return false;
                }

                return (rangePart === 'start') ? (limitDate - date < 0) : (limitDate - date > 0);
            },
            onDateSelect: (date) => {
                if (datePicker.state.rangePart === 'start') {
                    formatDateToInput(date, 'startDateInp');
                } else if (datePicker.state.rangePart === 'end') {
                    formatDateToInput(date, 'endDateInp');
                }
                datePicker.hide();
            },
        });
        datePicker.setSelection(new Date(Date.UTC(2010, 1, 10)));

        this.addSection({
            id: 'rangePart',
            title: '\'rangePart\' option',
            content: [
                inpGroup.elem,
                datePicker.elem,
            ],
        });
    }

    initMonthSelect() {
        const inputId = 'monthInp';
        let datePicker = null;
        const inpGroup = DateInputGroup.create({
            id: 'dpMonthGroup',
            inputId,
            buttonId: 'showMonthBtn',
            onButtonClick: () => datePicker.show(),
        });

        datePicker = DatePicker.create({
            relparent: inpGroup.elem,
            mode: 'month',
            onDateSelect: (date) => {
                formatMonthToInput(date, inputId);
                datePicker.hide();
            },
        });

        this.addSection({
            id: 'month',
            title: 'Month select',
            content: [
                inpGroup.elem,
                datePicker.elem,
            ],
        });
    }

    initYearSelect() {
        const inputId = 'yearInp';
        let datePicker = null;
        const inpGroup = DateInputGroup.create({
            id: 'dpYearGroup',
            inputId,
            buttonId: 'showYearBtn',
            onButtonClick: () => datePicker.show(),
        });

        datePicker = DatePicker.create({
            relparent: inpGroup.elem,
            mode: 'year',
            onDateSelect: (date) => {
                formatYearToInput(date, inputId);
                datePicker.hide();
            },
        });

        this.addSection({
            id: 'year',
            title: 'Year select',
            content: [
                inpGroup.elem,
                datePicker.elem,
            ],
        });
    }

    initFirstDay() {
        const items = [{
            id: 'dpMondayWeek',
            title: 'Monday',
            firstDay: 1,
        }, {
            id: 'dpSundayWeek',
            title: 'Sunday',
            firstDay: 7,
        }];

        this.addSection({
            id: 'firstDay',
            title: '\'firstDay\' option',
            content: LocalesContainer.create({
                items,
                renderItem: ({ firstDay }) => (
                    DatePicker.create({
                        static: true,
                        locales: ['en-US'],
                        firstDay,
                    }).elem
                ),
            }).elem,
        });
    }

    initLocales() {
        const items = [{
            id: 'dpEnLocale',
            title: 'en-US',
            locales: ['en-US'],
        }, {
            id: 'dpFrLocale',
            title: 'fr',
            locales: ['fr'],
        }, {
            id: 'dpRuLocale',
            title: 'ru',
            locales: ['ru'],
        }];

        this.addSection({
            id: 'locale',
            title: 'Locale',
            content: LocalesContainer.create({
                items,
                renderItem: ({ locales }) => (
                    DatePicker.create({
                        static: true,
                        locales,
                    }).elem
                ),
            }).elem,
        });
    }
}

DatePickerView.create();
