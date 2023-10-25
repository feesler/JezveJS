import { getClassNames } from '@jezvejs/dom';
import { getWeekDays, getWeekdayShort } from '@jezvejs/datetime';
import '../../css/common.scss';
import { LinkMenu } from '../LinkMenu/LinkMenu.js';
import './WeekDaySelect.scss';

const SELECT_CLASS = 'weekday-select';

const defaultProps = {
    locales: [],
    firstDay: undefined,
};

export class WeekDaySelect extends LinkMenu {
    constructor(props = {}) {
        const menuProps = {
            ...defaultProps,
            ...props,
            className: getClassNames(SELECT_CLASS, props.className),
        };

        const weekDayParams = {
            locales: menuProps.locales,
            options: {},
        };
        if (typeof props.firstDay === 'number') {
            weekDayParams.options.firstDay = props.firstDay;
        }

        const weekDays = getWeekDays(new Date(), weekDayParams);
        menuProps.items = weekDays.map((weekday) => ({
            id: weekday.getDay().toString(),
            title: getWeekdayShort(weekday, props.locales),
        }));

        super(menuProps);
    }
}
