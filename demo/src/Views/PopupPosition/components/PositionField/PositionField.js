import { getClassName } from '@jezvejs/dom';
import { RadioFieldset } from '../../../../Components/RadioFieldset/RadioFieldset.js';

import './PositionField.scss';

/* CSS classes */
const FIELD_CLASS = 'position-field';

const positions = [
    'top',
    'top-start',
    'top-end',
    'bottom',
    'bottom-start',
    'bottom-end',
    'left',
    'left-start',
    'left-end',
    'right',
    'right-start',
    'right-end',
];

const defaultProps = {
    title: 'Position',
    radioName: 'position',
    value: null,
};

export class PositionField extends RadioFieldset {
    constructor(props = {}) {
        const fieldProps = {
            ...defaultProps,
            ...props,
        };

        super({
            ...fieldProps,
            className: getClassName(FIELD_CLASS, props.className),
            items: positions.map((value) => ({
                value,
                label: value,
                checked: (fieldProps.value === value),
                className: `position-item_${value}`,
            })),
        });
    }
}
