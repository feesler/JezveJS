import { getClassName } from '@jezvejs/dom';
import { DropDown } from 'jezvejs/DropDown';

import { CustomComboBoxControls } from './ComboBoxControls/ComboBoxControls.js';
import { actions, reducer } from './reducer.js';

import './CustomControlsSelect.scss';

/** CSS classes */
const CUSTOM_CONTROLS_CLASS = 'dd__custom-combo-controls';

const defaultProps = {
    components: {
        ComboBoxControls: CustomComboBoxControls,
    },
};

/**
 * Drop Down with custom combo box buttons
 */
export class CustomControlsSelect extends DropDown {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            className: getClassName(CUSTOM_CONTROLS_CLASS, props.className),
            reducers: reducer,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });
    }

    onClick(e) {
        if (e.target.closest('.menu-btn')) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        super.onClick(e);
    }

    toggleLoading() {
        this.dispatch(actions.toggleLoading());
    }
}
