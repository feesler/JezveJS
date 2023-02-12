import {
    createElement,
    show,
    re,
    deepMeet,
    enable,
    insertAfter,
    prependChild,
    removeEvents,
    setEvents,
    isFunction,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { DropDownMultiSelectionItem } from './MultiSelectionItem.js';
import { DropDownClearButton } from './ClearButton.js';
import { DropDownToggleButton } from './ToggleButton.js';
import { getSelectedItems } from './utils.js';

/* CSS classes */
const COMBO_CLASS = 'dd__combo';
const VALUE_CLASS = 'dd__combo-value';
const CONTROLS_CLASS = 'dd__combo-controls';
/* Selection */
const SELECTION_CLASS = 'dd__selection';
const SINGLE_SELECTION_CLASS = 'dd__single-selection';
const PLACEHOLDER_CLASS = 'dd__single-selection_placeholder';
/* Input */
const INPUT_CLASS = 'dd__input';

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

        this.inputElem = this.props.inputElem;

        this.selectionItems = [];

        this.init();
        this.render(this.state);
    }

    init() {
        const valueContainer = createElement('div', { props: { className: VALUE_CLASS } });
        if (this.props.multi) {
            this.selectionElem = createElement('div', {
                props: { className: SELECTION_CLASS },
                events: { click: (e) => this.onDeleteSelectedItem(e) },
            });
            valueContainer.append(this.selectionElem);
        }
        this.staticElem = createElement('span', { props: { className: SINGLE_SELECTION_CLASS } });
        valueContainer.append(this.staticElem, this.inputElem);

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

        this.makeEditable(this.state.editable);
    }

    /** Enable/disable text input at combo element  */
    makeEditable(editable = true) {
        this.state.editable = editable;

        if (this.props.placeholder) {
            this.inputElem.placeholder = this.props.placeholder;
        }

        show(this.staticElem, !this.state.editable);
        show(this.inputElem, this.state.editable);

        this.inputElem.classList.toggle(INPUT_CLASS, !!this.state.editable);
        if (this.state.editable) {
            setEvents(this.inputElem, this.inputEvents);
            if (this.staticElem) {
                this.inputElem.value = this.staticElem.textContent;
            }
            this.inputElem.autocomplete = 'off';
        } else {
            removeEvents(this.inputElem, this.inputEvents);

            if (!this.staticElem) {
                return;
            }

            const content = (this.props.placeholder && this.inputElem.value.length === 0)
                ? this.props.placeholder
                : this.inputElem.value;
            this.staticElem.textContent = content;
        }
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

    /** Setup tabindexes of component */
    setTabIndexes(state) {
        if (!this.inputElem) {
            return;
        }

        if (state.disabled) {
            this.inputElem.removeAttribute('tabindex');
        } else {
            this.inputElem.setAttribute('tabindex', (state.editable) ? 0 : -1);
        }
    }

    /** Set text for single selection */
    renderSingleSelection(state) {
        if (this.props.multi) {
            if (state.editable) {
                this.inputElem.placeholder = this.props.placeholder;
                if (state.inputString === null) {
                    this.inputElem.value = '';
                } else {
                    this.inputElem.value = state.inputString;
                }
            } else if (this.staticElem) {
                this.staticElem.textContent = this.props.placeholder;
                this.staticElem.title = this.props.placeholder;
                this.staticElem.classList.add(PLACEHOLDER_CLASS);
            }

            return;
        }

        const [selectedItem] = getSelectedItems(state);
        const str = selectedItem?.title ?? '';
        const usePlaceholder = (str.length === 0);
        const placeholder = ((usePlaceholder) ? this.props.placeholder : str) ?? '';

        if (state.editable && this.inputElem) {
            this.inputElem.placeholder = placeholder;

            if (state.inputString == null) {
                this.inputElem.value = str;
            } else {
                this.inputElem.value = state.inputString;
            }
        } else if (!state.editable && this.staticElem) {
            const staticText = placeholder;
            this.staticElem.textContent = staticText;
            this.staticElem.title = staticText;
            this.staticElem.classList.toggle(PLACEHOLDER_CLASS, usePlaceholder);
        }
    }

    /** Render selection elements */
    renderSelection(state, prevState) {
        this.renderSingleSelection(state);
        if (this.props.listAttach || !this.props.multi) {
            return;
        }

        const prevSelectedItems = getSelectedItems(prevState);
        const selectedItems = getSelectedItems(state);
        const selectionChanged = (
            !deepMeet(prevSelectedItems, selectedItems)
            || state.actSelItemIndex !== prevState.actSelItemIndex
        );

        if (selectionChanged) {
            const SelectionItemComponent = this.props.components.MultiSelectionItem;
            const selectionItems = [];

            selectedItems.forEach((item, index) => {
                const props = { ...item, active: state.actSelItemIndex === index };

                let selItem = this.getSelectionItemById(item.id);
                if (selItem) {
                    selItem.setState(props);
                } else {
                    selItem = SelectionItemComponent.create(props);
                    if (selectionItems.length === 0) {
                        prependChild(this.selectionElem, selItem.elem);
                    } else {
                        const lastItem = selectionItems[selectionItems.length - 1];
                        insertAfter(selItem.elem, lastItem.elem);
                    }

                    selItem.elem.tabIndex = -1;
                    selItem.elem.dataset.id = item.id;
                }

                selectionItems.push(selItem);
            });

            // Remove items not included in new state
            this.selectionItems.forEach((item) => {
                if (selectionItems.includes(item)) {
                    return;
                }

                re(item.elem);
            });

            this.selectionItems = selectionItems;

            show(this.selectionElem, selectedItems.length > 0);
            this.clearBtn?.show(selectedItems.length > 0);
        }
    }

    render(state, prevState = {}) {
        if (state.disabled !== prevState?.disabled) {
            enable(this.inputElem, !state.disabled);
            this.clearBtn?.enable(!state.disabled);
            this.toggleBtn?.enable(!state.disabled);
        }

        this.setTabIndexes(state);
        this.renderSelection(state, prevState);
    }
}
