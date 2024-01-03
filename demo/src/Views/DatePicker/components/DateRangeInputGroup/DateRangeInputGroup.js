import { createElement } from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';
import { Input } from 'jezvejs/Input';
import { InputGroup } from 'jezvejs/InputGroup';

import { CalendarIcon } from '../../../../assets/icons/CalendarIcon.js';

const defaultProps = {
    startInputId: undefined,
    startButtonId: undefined,
    endInputId: undefined,
    endButtonId: undefined,
    onStartInput: null,
    onStartButtonClick: null,
    onEndInput: null,
    onEndButtonClick: null,
};

/**
 * Input group component with 'start' and 'end' date inputs
 */
export class DateRangeInputGroup extends InputGroup {
    constructor(props = {}) {
        const userProps = {
            ...defaultProps,
            ...props,
        };

        super({
            ...userProps,
            children: [
                Input.create({
                    id: userProps.startInputId,
                    className: 'input-group__input',
                    onInput: (e) => userProps.onStartInput?.(e),
                }).elem,
                Button.create({
                    id: userProps.startButtonId,
                    className: 'input-group__btn',
                    icon: CalendarIcon(),
                    onClick: (e) => userProps.onStartButtonClick?.(e),
                }).elem,
                createElement('div', { className: 'input-group__text', textContent: '-' }),
                Input.create({
                    id: userProps.endInputId,
                    className: 'input-group__input',
                    onInput: (e) => userProps.onEndInput?.(e),
                }).elem,
                Button.create({
                    id: userProps.endButtonId,
                    className: 'input-group__btn',
                    icon: CalendarIcon(),
                    onClick: (e) => userProps.onEndButtonClick?.(e),
                }).elem,
            ],
        });
    }
}
