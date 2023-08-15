import '../../css/common.scss';
import { getClassNames } from '../../js/common.js';
import { getWeekDays, getWeekdayShort } from '../../js/DateUtils.js';
import { LinkMenu } from '../LinkMenu/LinkMenu.js';
import './WeekDaySelect.scss';

const SELECT_CLASS = 'weekday-select';

const defaultProps = {
    locales: [],
    firstDay: undefined,
    beforeContent: false,
    afterContent: false,
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
            title: getWeekdayShort(weekday, props.locales),
            value: weekday.getDay().toString(),
        }));

        super(menuProps);
    }
}
