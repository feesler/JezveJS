import { Button } from 'jezvejs/Button';
import { Input } from 'jezvejs/Input';
import { InputGroup } from 'jezvejs/InputGroup';

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
                    icon: 'calendar-icon',
                    onClick: (e) => userProps.onButtonClick?.(e),
                }).elem,
            ],
        });
    }
}