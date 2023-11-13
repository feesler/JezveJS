import { isDate } from '@jezvejs/types';
import { createElement, getClassName } from '@jezvejs/dom';
import { getShortMonthName, MONTHS_COUNT } from '@jezvejs/datetime';
import { Component } from '../../../../js/Component.js';
import {
    getHeaderTitle,
    getNextViewDate,
    getPrevViewDate,
    YEAR_VIEW,
} from '../../utils.js';

/* CSS classes */
const VIEW_CONTAINER_CLASS = 'dp__view-container dp__year-view';
const CELL_CLASS = 'dp__cell';
const YEAR_CELL_CLASS = 'dp__year-view__cell';

const defaultProps = {
    renderHeader: false,
    header: null,
    components: {
        Header: null,
    },
};

export class DatePickerYearView extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });

        const { date } = this.props;
        if (!isDate(date)) {
            throw new Error('Invalid date');
        }

        this.type = YEAR_VIEW;
        this.items = [];

        this.state = {
            ...this.props,
            title: getHeaderTitle({
                viewType: this.type,
                date,
            }),
            nav: {
                prev: getPrevViewDate(date, this.type),
                next: getNextViewDate(date, this.type),
            },
        };

        this.init();
    }

    get date() {
        return this.state.date;
    }

    get title() {
        return this.state.title;
    }

    get nav() {
        return this.state.nav;
    }

    init() {
        const { date } = this.state;
        const rYear = date.getFullYear();

        this.elem = createElement('div', { props: { className: VIEW_CONTAINER_CLASS } });

        // year header
        const { Header } = this.props.components;
        if (this.props.renderHeader && Header) {
            this.header = Header.create({
                ...(this.props.header ?? {}),
                title: this.state.title,
            });
            this.elem.append(this.header.elem);
        }

        // months of current year
        for (let i = 0; i < MONTHS_COUNT; i += 1) {
            const monthDate = new Date(rYear, i, 1);
            const item = {
                date: monthDate,
                elem: createElement('div', {
                    props: {
                        className: getClassName(CELL_CLASS, YEAR_CELL_CLASS),
                        textContent: getShortMonthName(monthDate, this.props.locales),
                    },
                }),
            };

            this.items.push(item);
            this.elem.append(item.elem);
        }
    }
}
