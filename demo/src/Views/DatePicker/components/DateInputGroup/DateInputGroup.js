import { getClassName } from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';
import { Input } from 'jezvejs/Input';
import { InputGroup } from 'jezvejs/InputGroup';

import { CalendarIcon } from '../../../../assets/icons/CalendarIcon.js';

import './DateInputGroup.scss';

const DATE_INPUT_GROUP_CLASS = 'date-input-group';

const defaultProps = {
    inputId: undefined,
    buttonId: undefined,
    value: '',
    placeholder: '',
    onInput: null,
    onButtonClick: null,
};

/**
 * Input group with 'calendar' icon button component
 */
export class DateInputGroup extends InputGroup {
    constructor(props = {}) {
        const userProps = {
            ...defaultProps,
            ...props,
            className: getClassName(DATE_INPUT_GROUP_CLASS, props.className),
        };

        super({
            ...userProps,
            children: [
                Input.create({
                    id: userProps.inputId,
                    className: 'input-group__input',
                    placeholder: userProps.placeholder,
                    value: userProps.value,
                    onInput: (e) => userProps.onInput?.(e),
                }).elem,
                Button.create({
                    id: userProps.buttonId,
                    className: 'input-group__btn',
                    icon: CalendarIcon(),
                    onClick: (e) => userProps.onButtonClick?.(e),
                }).elem,
            ],
        });
    }
}
