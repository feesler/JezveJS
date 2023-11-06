import {
    TestComponent,
    query,
    queryAll,
    prop,
    isVisible,
    click,
    wait,
    evaluate,
    asyncMap,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';

const monthTitles = [{
    locale: 'en',
    short: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'],
    long: ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'],
}, {
    locale: 'fr',
    months: ['jan', 'fév', 'mar', 'avr', 'mai', 'jui', 'jui', 'aoû', 'sep', 'oct', 'nov', 'déc'],
    long: ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'],
}, {
    locale: 'ru',
    months: ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'],
    long: ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'],
}];

export class DatePicker extends TestComponent {
    async parseContent() {
        const res = {
            wrapper: await query(this.elem, '.dp__wrapper'),
        };

        res.visible = await evaluate((el) => (!!el && !el.hidden), res.wrapper);
        if (!res.visible) {
            return res;
        }

        res.prevBtn = await query(res.wrapper, '.dp__header .dp__header_nav:first-child');
        res.nextBtn = await query(res.wrapper, '.dp__header .dp__header_nav:last-child');
        res.titleElem = await query(res.wrapper, '.dp__header .dp__header_title');
        res.title = await prop(res.titleElem, 'textContent');

        const elems = await queryAll(res.wrapper, '.dp__current-view .dp__cell');

        res.viewType = await evaluate((elem) => {
            if (elem?.classList?.contains('dp__year-view__cell')) {
                return 'year';
            }
            if (elem?.classList?.contains('dp__year-range-view__cell')) {
                return 'yearRange';
            }

            return 'month';
        }, elems[0]);

        res.allCells = await asyncMap(elems, async (elem) => {
            const cell = await evaluate((el) => ({
                title: el.textContent,
                weekday: el.classList.contains('dp__weekday-cell'),
                other: el.classList.contains('dp__other-month-cell'),
                active: el.classList.contains('dp__cell_act'),
                highlighted: el.classList.contains('dp__cell_hl'),
                disabled: el.hasAttribute('disabled'),
            }), elem);
            cell.elem = elem;

            return cell;
        });
        res.cells = res.allCells.filter((item) => !item.other && !item.weekday);

        res.current = this.parseHeader(res.title, res.viewType);

        return res;
    }

    getMonthByName(name, short) {
        const lowerName = name.toLowerCase();

        for (const localeData of monthTitles) {
            const names = (short) ? localeData.short : localeData.long;
            const index = names.indexOf(lowerName);
            if (index !== -1) {
                return { locale: localeData.locale, index };
            }
        }

        return { index: -1 };
    }

    parseHeader(title, viewType) {
        const res = {};

        if (viewType === 'month') {
            const [month, year] = title.split(' ');

            const monthInfo = this.getMonthByName(month, false);
            res.month = monthInfo.index;
            assert(res.month !== -1, `Invalid month string: ${month}`);
            res.year = parseInt(year, 10);
        } else if (viewType === 'year') {
            res.year = parseInt(title, 10);
        } else if (viewType === 'yearRange') {
            const [startYear, endYear] = title.split('-');
            res.yearRange = {
                start: parseInt(startYear, 10),
                end: parseInt(endYear, 10),
            };
        }

        return res;
    }

    async selectCell(val) {
        const visible = await isVisible(this.content.wrapper);
        assert(visible, 'DatePicker is not visible');

        const lval = val.toString().toLowerCase();
        const cell = this.content.cells.find((item) => item.title.toLowerCase() === lval);
        assert(cell, 'Specified cell not found');
        assert(!cell.disabled, 'Specified cell is disabled');

        return click(cell.elem);
    }

    async isTitleChanged() {
        const titleElem = await query(this.elem, '.dp__wrapper .dp__header_title');
        if (!titleElem) {
            return false;
        }

        const title = await prop(titleElem, 'textContent');

        return title !== this.content.title;
    }

    async navigateToPrevious() {
        await click(this.content.prevBtn);
        await wait(() => this.isTitleChanged());
        await this.parse();
    }

    async navigateToNext() {
        await click(this.content.nextBtn);
        await wait(() => this.isTitleChanged());
        await this.parse();
    }

    async zoomOut() {
        await click(this.content.titleElem);
        await wait(() => this.isTitleChanged());
        await this.parse();
    }

    async selectYear(year, waitForViewChange = true) {
        assert(this.content.viewType === 'yearRange', `Invalid type of date picker view: ${this.content.viewType}`);

        while (this.content.current.yearRange.start > year) {
            this.navigateToPrevious();
        }

        while (this.content.current.yearRange.end < year) {
            this.navigateToNext();
        }

        await this.selectCell(year);
        if (!waitForViewChange) {
            return;
        }

        await wait(() => this.isTitleChanged());
        await this.parse();
    }

    async selectMonth(month, year, waitForViewChange = true) {
        assert(this.content.viewType === 'year', `Invalid type of date picker view: ${this.content.viewType}`);

        if (this.content.current.year !== year) {
            if (this.content.current.year > year && this.content.current.year - year <= 2) {
                while (this.content.current.year > year) {
                    await this.navigateToPrevious();
                }
            } else if (this.content.current.year < year && year - this.content.current.year <= 2) {
                while (this.content.current.year < year) {
                    await this.navigateToNext();
                }
            } else {
                await this.zoomOut();
                await this.selectYear(year);
                await this.parse();
            }
        }

        const cell = this.content.cells[month];
        await this.selectCell(cell.title);
        if (!waitForViewChange) {
            return;
        }

        await wait(() => this.isTitleChanged());
        await this.parse();
    }

    async selectDate(date) {
        assert.isDate(date, 'Invalid parameters');
        assert(this.content.viewType === 'month', `Invalid type of date picker view: ${this.content.viewType}`);

        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();

        if (this.content.current.year !== year) {
            await this.zoomOut();
            await this.selectMonth(month, year);
        }
        assert(this.content.current.year === year, 'Fail to set up specified year');

        if (this.content.current.month !== month) {
            if (
                this.content.current.month > month
                && this.content.current.month - month <= 2
            ) {
                while (this.content.current.month > month) {
                    await this.navigateToPrevious();
                }
            } else if (
                this.content.current.month < month
                && month - this.content.current.month <= 2
            ) {
                while (this.content.current.month < month) {
                    await this.navigateToNext();
                }
            } else {
                await this.zoomOut();
                await this.selectMonth(month, year);
            }
        }

        assert(this.content.current.month === month, 'Fail to set up specified month');

        return this.selectCell(day);
    }

    async selectRange(date1, date2) {
        assert.isDate(date1, 'Invalid parameters');
        assert.isDate(date2, 'Invalid parameters');

        await this.selectDate(date1);
        return this.selectDate(date2);
    }

    getSelectedRange() {
        return structuredClone(this.content.value);
    }
}
