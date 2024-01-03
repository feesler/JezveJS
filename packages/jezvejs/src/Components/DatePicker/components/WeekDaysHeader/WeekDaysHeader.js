import { createElement } from '@jezvejs/dom';
import { getWeekDays, getWeekdayShort } from '@jezvejs/datetime';
import { Component } from '../../../../Component.js';
import './WeekDaysHeader.scss';

/* CSS classes */
const HEADER_CLASS = 'dp__weekdays-header';
const WEEKDAY_CELL_CLASS = 'dp__cell dp__month-view_cell dp__weekday-cell';

const defaultProps = {
    locales: [],
    firstDay: null,
};

/** Weekdays header component */
export class DatePickerWeekDaysHeader extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = {
            ...this.props,
        };

        this.init();
        this.render(this.state);
    }

    init() {
        this.elem = createElement('div', {
            className: HEADER_CLASS,
        });
    }

    renderWeekdayItem(item, state) {
        return createElement('div', {
            className: WEEKDAY_CELL_CLASS,
            textContent: getWeekdayShort(item.weekday, state.locales),
        });
    }

    render(state, prevState = {}) {
        const { locales, firstDay } = state;

        if (
            locales === prevState?.locales
            && firstDay === prevState?.firstDay
        ) {
            return;
        }

        const params = {
            locales,
        };
        if (typeof firstDay === 'number') {
            params.options = {
                firstDay,
            };
        }

        const week = getWeekDays(new Date(), params);
        const elems = week.map((weekday) => (
            this.renderWeekdayItem({ weekday }, state)
        ));
        this.elem.replaceChildren(...elems);
    }
}
