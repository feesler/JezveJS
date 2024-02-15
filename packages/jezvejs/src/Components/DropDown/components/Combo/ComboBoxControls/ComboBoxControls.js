import { createElement } from '@jezvejs/dom';
import { Component } from '../../../../../Component.js';
import { getSelectedItems } from '../../../utils.js';

import { DropDownClearButton } from '../ClearButton/ClearButton.js';
import { DropDownToggleButton } from '../ToggleButton/ToggleButton.js';

import './ComboBoxControls.scss';

/* CSS classes */
const CONTROLS_CLASS = 'dd__combo-controls';

const defaultProps = {
    multiple: false,
    disabled: false,
    showClearButton: true,
    showToggleButton: true,
    items: [],
    actSelItemIndex: -1,
    onClearSelection: null,
    components: {
        ToggleButton: DropDownToggleButton,
        ClearButton: DropDownClearButton,
    },
};

/**
 * Combo box controls container
 */
export class DropDownComboBoxControls extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });

        this.state = {
            multiple: this.props.multiple,
            disabled: this.props.disabled,
            items: this.props.items,
            actSelItemIndex: this.props.actSelItemIndex,
        };

        this.inputEvents = { input: (e) => this.onInput(e) };
        this.selectionItems = [];

        this.init();
        this.render(this.state);
    }

    init() {
        this.elem = createElement('div', { className: CONTROLS_CLASS });

        if (this.state.multiple && this.props.showClearButton) {
            const { ClearButton } = this.props.components;
            this.clearBtn = ClearButton.create({
                onClick: (e) => this.onClearSelection(e),
            });
            this.elem.append(this.clearBtn.elem);
        }

        if (this.props.showToggleButton) {
            const { ToggleButton } = this.props.components;
            this.toggleBtn = ToggleButton.create();
            this.elem.append(this.toggleBtn.elem);
        }
    }

    /** Clear selection button 'click' event handler */
    onClearSelection(e) {
        this.notifyEvent('onClearSelection', e);
    }

    renderClearButton(state, prevState) {
        if (
            state.items === prevState.items
            && state.disabled === prevState.disabled
            && state.multiple === prevState.multiple
        ) {
            return;
        }

        const selectedItems = getSelectedItems(state);

        const showClearBtn = (
            state.multiple
            && this.props.showClearButton
            && selectedItems.length > 0
        );

        this.clearBtn?.show(showClearBtn);
        this.clearBtn?.enable(!state.disabled);
    }

    renderToggleButton(state, prevState) {
        if (state.disabled === prevState.disabled) {
            return;
        }

        this.toggleBtn?.enable(!state.disabled);
    }

    render(state, prevState = {}) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.renderClearButton(state, prevState);
        this.renderToggleButton(state, prevState);
    }
}
