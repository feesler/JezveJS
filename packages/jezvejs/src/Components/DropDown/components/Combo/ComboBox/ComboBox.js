import { createElement } from '@jezvejs/dom';
import { Component } from '../../../../../Component.js';
import { getSelectedItems } from '../../../utils.js';

// Local components
import { DropDownMultiSelectionItem } from '../MultiSelectionItem/MultiSelectionItem.js';
import { DropDownComboBoxControls } from '../ComboBoxControls/ComboBoxControls.js';
import { DropDownClearButton } from '../ClearButton/ClearButton.js';
import { DropDownToggleButton } from '../ToggleButton/ToggleButton.js';
import { DropDownInput } from '../../Input/Input.js';
import { DropDownMultipleSelection } from '../MultipleSelection/MultipleSelection.js';
import { DropDownSingleSelection } from '../SingleSelection/SingleSelection.js';
import { DropDownPlaceholder } from '../Placeholder/Placeholder.js';

import './ComboBox.scss';

/* CSS classes */
const COMBO_CLASS = 'dd__combo';
const VALUE_CLASS = 'dd__combo-value';

const defaultProps = {
    inputElem: null,
    multiple: false,
    editable: false,
    enableFilter: false,
    disabled: false,
    placeholder: null,
    showMultipleSelection: true,
    showClearButton: true,
    showToggleButton: true,
    items: [],
    actSelItemIndex: -1,
    onInput: null,
    onDeleteSelectedItem: null,
    onClearSelection: null,
    components: {
        Input: DropDownInput,
        Placeholder: DropDownPlaceholder,
        SingleSelection: DropDownSingleSelection,
        MultipleSelection: DropDownMultipleSelection,
        MultiSelectionItem: DropDownMultiSelectionItem,
        ToggleButton: DropDownToggleButton,
        ClearButton: DropDownClearButton,
        ComboBoxControls: DropDownComboBoxControls,
    },
};

export class DropDownComboBox extends Component {
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
            editable: this.props.editable,
            disabled: this.props.disabled,
            items: this.props.items,
            showClearButton: this.props.showClearButton,
            showToggleButton: this.props.showToggleButton,
            actSelItemIndex: this.props.actSelItemIndex,
        };

        this.inputEvents = { input: (e) => this.onInput(e) };
        this.selectionItems = [];

        this.init();
    }

    init() {
        const { Input, SingleSelection, Placeholder } = this.props.components;

        this.input = Input.create({
            elem: this.props.inputElem,
            placeholder: this.props.placeholder,
            onInput: (e) => this.onInput(e),
        });
        this.input.show(this.state.editable);

        const valueContainer = createElement('div', { className: VALUE_CLASS });
        if (this.state.multiple && this.props.showMultipleSelection) {
            const { MultipleSelection, MultiSelectionItem } = this.props.components;
            this.multipleSelection = MultipleSelection.create({
                ItemComponent: MultiSelectionItem,
                closeable: true,
                onCloseItem: (_, e) => this.onDeleteSelectedItem(e),
            });
            valueContainer.append(this.multipleSelection.elem);
        }

        this.placeholder = Placeholder.create();
        this.placeholder.show(!this.state.editable);

        this.singleSelection = SingleSelection.create();
        this.singleSelection.show(!this.state.editable);

        valueContainer.append(this.placeholder.elem, this.singleSelection.elem, this.input.elem);

        const { ComboBoxControls } = this.props.components;
        this.controls = ComboBoxControls.create({
            ...this.state,
            onClearSelection: this.props.onClearSelection,
        });

        this.elem = createElement('div', {
            className: COMBO_CLASS,
            children: [
                valueContainer,
                this.controls.elem,
            ],
        });

        this.render(this.state);
    }

    /** Text input 'input' event handler  */
    onInput(e) {
        this.notifyEvent('onInput', e);
    }

    /** Multiple selection element 'click' event handler */
    onDeleteSelectedItem(e) {
        this.notifyEvent('onDeleteSelectedItem', e);
    }

    /** Clear selection button 'click' event handler */
    onClearSelection(e) {
        this.notifyEvent('onClearSelection', e);
    }

    /** Returns selection item by id */
    getSelectionItemById(itemId) {
        const strId = itemId?.toString();
        return this.selectionItems.find((item) => item.id === strId);
    }

    /** Set text for single selection */
    renderSingleSelection(state) {
        const [item] = getSelectedItems(state);
        const str = item?.title ?? '';
        const usePlaceholder = (
            !this.props.useSingleSelectionAsPlaceholder
            && this.props.placeholder?.length > 0
        );
        const placeholder = (usePlaceholder) ? this.props.placeholder : str;

        if (state.editable) {
            this.input.setState((inputState) => ({
                ...inputState,
                placeholder,
                value: state.inputString ?? str,
            }));
        } else if (usePlaceholder) {
            this.placeholder.setState((placeholderState) => ({
                ...placeholderState,
                placeholder,
            }));
        } else {
            this.singleSelection.setState((selectionState) => ({
                ...selectionState,
                item,
            }));
        }

        this.placeholder.show(!state.editable && usePlaceholder);
        this.singleSelection.show(!state.editable && !usePlaceholder);
    }

    /** Render selection elements */
    renderSelection(state) {
        this.input.show(state.editable);

        if (!state.multiple) {
            this.renderSingleSelection(state);
            return;
        }

        if (state.editable) {
            this.input.setState((inputState) => ({
                ...inputState,
                placeholder: this.props.placeholder,
                value: state.inputString,
            }));
        } else {
            this.placeholder.setState((placeholderState) => ({
                ...placeholderState,
                placeholder: this.props.placeholder,
            }));
        }
        this.placeholder.show(!state.editable);
        this.singleSelection.show(false);

        const selectedItems = getSelectedItems(state);

        if (this.props.showMultipleSelection) {
            const activeItem = (state.actSelItemIndex === -1)
                ? null
                : selectedItems[state.actSelItemIndex];

            this.multipleSelection.setState((selectionState) => ({
                ...selectionState,
                items: selectedItems,
                activeItemId: activeItem?.id ?? 0,
                disabled: state.disabled,
            }));
            this.multipleSelection.show(selectedItems.length > 0);
        }

        this.clearBtn?.show(selectedItems.length > 0);
    }

    renderControls(state) {
        this.controls.setState((controlsState) => ({
            ...controlsState,
            ...state,
        }));
    }

    render(state, prevState = {}) {
        if (state.disabled !== prevState?.disabled) {
            this.input.enable(!state.disabled);
        }

        this.renderSelection(state, prevState);
        this.renderControls(state, prevState);
    }
}
