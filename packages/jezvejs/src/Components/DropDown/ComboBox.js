import { createElement, show, isFunction } from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { DropDownMultiSelectionItem } from './MultiSelectionItem.js';
import { DropDownClearButton } from './ClearButton.js';
import { DropDownToggleButton } from './ToggleButton.js';
import { getSelectedItems } from './utils.js';
import { DropDownInput } from './Input.js';
import { DropDownMultipleSelection } from './MultipleSelection.js';

/* CSS classes */
const COMBO_CLASS = 'dd__combo';
const VALUE_CLASS = 'dd__combo-value';
const CONTROLS_CLASS = 'dd__combo-controls';
/* Selection */
const SINGLE_SELECTION_CLASS = 'dd__single-selection';
const PLACEHOLDER_CLASS = 'dd__single-selection_placeholder';

const defaultProps = {
    inputElem: null,
    multi: false,
    editable: false,
    enableFilter: false,
    disabled: false,
    placeholder: null,
    items: [],
    actSelItemIndex: -1,
    onInput: null,
    onDeleteSelectedItem: null,
    onClearSelection: null,
    components: {
        Input: DropDownInput,
        MultipleSelection: DropDownMultipleSelection,
        MultiSelectionItem: DropDownMultiSelectionItem,
        ToggleButton: DropDownToggleButton,
        ClearButton: DropDownClearButton,
    },
};

export class DropDownComboBox extends Component {
    constructor(props = {}) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
            components: {
                ...defaultProps.components,
                ...this.props.components,
            },
        };

        this.state = {
            editable: this.props.editable,
            disabled: this.props.disabled,
            items: this.props.items,
            actSelItemIndex: this.props.actSelItemIndex,
        };

        this.inputEvents = { input: (e) => this.onInput(e) };
        this.selectionItems = [];

        this.init();
    }

    init() {
        const { Input } = this.props.components;

        this.input = Input.create({
            elem: this.props.inputElem,
            placeholder: this.props.placeholder,
            onInput: (e) => this.onInput(e),
        });
        this.input.show(this.state.editable);

        const valueContainer = createElement('div', { props: { className: VALUE_CLASS } });
        if (this.props.multi) {
            const { MultipleSelection, MultiSelectionItem } = this.props.components;
            this.multipleSelection = MultipleSelection.create({
                ItemComponent: MultiSelectionItem,
                onItemClick: (_, e) => this.onDeleteSelectedItem(e),
            });
            valueContainer.append(this.multipleSelection.elem);
        }

        this.staticElem = createElement('span', { props: { className: SINGLE_SELECTION_CLASS } });
        show(this.staticElem, !this.state.editable);

        valueContainer.append(this.staticElem, this.input.elem);

        const controls = createElement('div', { props: { className: CONTROLS_CLASS } });

        if (this.props.multi) {
            const { ClearButton } = this.props.components;
            this.clearBtn = ClearButton.create({
                onClick: (e) => this.onClearSelection(e),
            });
            controls.append(this.clearBtn.elem);
        }

        const { ToggleButton } = this.props.components;
        this.toggleBtn = ToggleButton.create();
        controls.append(this.toggleBtn.elem);

        this.elem = createElement('div', {
            props: { className: COMBO_CLASS },
            children: [valueContainer, controls],
        });

        this.render(this.state);
    }

    /** Text input 'input' event handler  */
    onInput(e) {
        if (isFunction(this.props.onInput)) {
            this.props.onInput(e);
        }
    }

    /** Multiple selection element 'click' event handler */
    onDeleteSelectedItem(e) {
        if (isFunction(this.props.onDeleteSelectedItem)) {
            this.props.onDeleteSelectedItem(e);
        }
    }

    /** Clear selection button 'click' event handler */
    onClearSelection(e) {
        if (isFunction(this.props.onClearSelection)) {
            this.props.onClearSelection(e);
        }
    }

    /** Returns selection item by id */
    getSelectionItemById(itemId) {
        const strId = itemId?.toString();
        return this.selectionItems.find((item) => item.id === strId);
    }

    /** Set text for single selection */
    renderSingleSelection(state) {
        if (this.props.multi) {
            if (state.editable) {
                this.input.setState((inputState) => ({
                    ...inputState,
                    placeholder: this.props.placeholder,
                    value: state.inputString,
                }));
            } else {
                this.staticElem.textContent = this.props.placeholder;
                this.staticElem.title = this.props.placeholder;
                this.staticElem.classList.add(PLACEHOLDER_CLASS);
            }

            return;
        }

        const [selectedItem] = getSelectedItems(state);
        const str = selectedItem?.title ?? '';
        const usePlaceholder = (str.length === 0);
        const placeholder = (usePlaceholder) ? this.props.placeholder : str;

        if (state.editable) {
            this.input.setState((inputState) => ({
                ...inputState,
                placeholder,
                value: state.inputString ?? str,
            }));
        } else if (!state.editable) {
            const staticText = placeholder;
            this.staticElem.textContent = staticText;
            this.staticElem.title = staticText;
            this.staticElem.classList.toggle(PLACEHOLDER_CLASS, usePlaceholder);
        }
    }

    /** Render selection elements */
    renderSelection(state) {
        this.renderSingleSelection(state);
        if (!this.props.multi) {
            return;
        }

        const selectedItems = getSelectedItems(state);
        const activeItem = (state.actSelItemIndex === -1)
            ? null
            : selectedItems[state.actSelItemIndex];

        this.multipleSelection.setState((selectionState) => ({
            ...selectionState,
            items: selectedItems,
            activeItemId: activeItem?.id ?? 0,
        }));
        this.multipleSelection.show(selectedItems.length > 0);

        this.clearBtn?.show(selectedItems.length > 0);
    }

    render(state, prevState = {}) {
        if (state.disabled !== prevState?.disabled) {
            this.input.enable(!state.disabled);
            this.clearBtn?.enable(!state.disabled);
            this.toggleBtn?.enable(!state.disabled);
        }

        this.renderSelection(state, prevState);
    }
}
