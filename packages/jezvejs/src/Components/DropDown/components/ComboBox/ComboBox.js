import { createElement, isFunction } from '../../../../js/common.js';
import { Component } from '../../../../js/Component.js';
import { getSelectedItems } from '../../utils.js';
import { DropDownMultiSelectionItem } from '../MultiSelectionItem/MultiSelectionItem.js';
import { DropDownClearButton } from '../ClearButton/ClearButton.js';
import { DropDownToggleButton } from '../ToggleButton/ToggleButton.js';
import { DropDownInput } from '../Input/Input.js';
import { DropDownMultipleSelection } from '../MultipleSelection/MultipleSelection.js';
import { DropDownSingleSelection } from '../SingleSelection/SingleSelection.js';
import { DropDownPlaceholder } from '../Placeholder/Placeholder.js';
import './style.scss';

/* CSS classes */
const COMBO_CLASS = 'dd__combo';
const VALUE_CLASS = 'dd__combo-value';
const CONTROLS_CLASS = 'dd__combo-controls';

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
        Placeholder: DropDownPlaceholder,
        SingleSelection: DropDownSingleSelection,
        MultipleSelection: DropDownMultipleSelection,
        MultiSelectionItem: DropDownMultiSelectionItem,
        ToggleButton: DropDownToggleButton,
        ClearButton: DropDownClearButton,
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
        const { Input, SingleSelection, Placeholder } = this.props.components;

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

        this.placeholder = Placeholder.create();
        this.placeholder.show(!this.state.editable);

        this.singleSelection = SingleSelection.create();
        this.singleSelection.show(!this.state.editable);

        valueContainer.append(this.placeholder.elem, this.singleSelection.elem, this.input.elem);

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
        const [item] = getSelectedItems(state);
        const str = item?.title ?? '';
        const usePlaceholder = (str.length === 0);
        const placeholder = (usePlaceholder) ? this.props.placeholder : str;

        if (state.editable) {
            this.input.setState((inputState) => ({
                ...inputState,
                placeholder,
                value: state.inputString ?? str,
            }));
        } else {
            if (usePlaceholder) {
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
            this.placeholder.show(usePlaceholder);
            this.singleSelection.show(!usePlaceholder);
        }
    }

    /** Render selection elements */
    renderSelection(state) {
        if (!this.props.multi) {
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
            this.placeholder.show(true);
            this.singleSelection.show(false);
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
