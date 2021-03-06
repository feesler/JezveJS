import {
    TestComponent,
    assert,
    query,
    queryAll,
    hasClass,
    prop,
    isVisible,
    click,
    wait,
    copyObject,
} from 'jezve-test';

const shortMonthTitles = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const monthTitles = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];

export class DatePicker extends TestComponent {
    async parseContent() {
        const res = {
            wrapper: await query(this.elem, '.dp__wrapper'),
        };

        res.prevBtn = await query(res.wrapper, '.dp__header .dp__header_nav:first-child');
        res.nextBtn = await query(res.wrapper, '.dp__header .dp__header_nav:last-child');
        res.titleElem = await query(res.wrapper, '.dp__header .dp__header_title');
        res.title = await prop(res.titleElem, 'textContent');

        res.cells = [];
        res.viewType = 'month';
        const elems = await queryAll(res.wrapper, '.dp__view-container .dp__cell');
        for (const elem of elems) {
            if (await hasClass(elem, 'dp__year-view__cell')) {
                res.viewType = 'year';
            } else if (await hasClass(elem, 'dp__year-range-view__cell')) {
                res.viewType = 'yearRange';
            }

            if (await hasClass(elem, 'dp__other-month-cell')) {
                continue;
            }

            const cell = {
                elem,
                title: await prop(elem, 'textContent'),
                active: await hasClass(elem, 'dp__cell_act'),
                highlighted: await hasClass(elem, 'dp__cell_hl'),
            };

            res.cells.push(cell);
        }

        res.current = this.parseHeader(res.title, res.viewType);

        return res;
    }

    parseHeader(title, viewType) {
        const res = {};

        if (viewType === 'month') {
            const [month, year] = title.split(' ');

            res.month = monthTitles.indexOf(month.toLowerCase());
            assert(res.month !== -1, 'Invalid month string');
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

        await click(cell.elem);
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

    async selectYear(year) {
        assert(this.content.viewType === 'yearRange', `Invalid type of date picker view: ${this.content.viewType}`);

        while (this.content.current.yearRange.start > year) {
            this.navigateToPrevious();
        }

        while (this.content.current.yearRange.end < year) {
            this.navigateToNext();
        }

        await this.selectCell(year);
        await wait(() => this.isTitleChanged());
        await this.parse();
    }

    async selectMonth(month, year) {
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

        await this.selectCell(shortMonthTitles[month]);
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
        return copyObject(this.content.value);
    }
}
