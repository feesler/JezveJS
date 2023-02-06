import {
    isFunction,
    createElement,
    createSVGElement,
    removeChilds,
    re,
    px,
    insertAfter,
    prependChild,
    show,
    setEmptyClick,
    removeEmptyClick,
    getOffset,
    isVisible,
    getCursorPos,
    setEvents,
    removeEvents,
    deepMeet,
    enable,
    asArray,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { PopupPosition } from '../PopupPosition/PopupPosition.js';
import { CloseButton } from '../CloseButton/CloseButton.js';
import { DropDownListItem } from './ListItem.js';
import { DropDownMultiSelectionItem } from './MultiSelectionItem.js';
import '../../css/common.scss';
import './style.scss';

/* Icons */
const TOGGLE_ICON = 'm0.6 0.88-0.35 0.35 1.6 1.6 1.6-1.6-0.35-0.35-1.2 1.2z';

/* CSS classes */
/* Container */
const CONTAINER_CLASS = 'dd__container';
const MULTIPLE_CLASS = 'dd__container_multiple';
const ACTIVE_CLASS = 'dd__container_active';
const ATTACHED_CLASS = 'dd__container_attached';
const NATIVE_CLASS = 'dd__container_native';
const FULLSCREEN_CLASS = 'dd__fullscreen';
const FULLSCREEN_BG_CLASS = 'dd__background';
const EDITABLE_CLASS = 'dd__editable';
const INPUT_CLASS = 'dd__input';
/* Selection */
const SELECTION_CLASS = 'dd__selection';
const SINGLE_SELECTION_CLASS = 'dd__single-selection';
/* List */
const LIST_CLASS = 'dd__list';
const LIST_OPEN_CLASS = 'dd__open';
const LIST_GROUP_CLASS = 'dd__list-group';
const LIST_GROUP_LABEL_CLASS = 'dd__list-group__label';
const NOT_FOUND_CLASS = 'dd__not-found-message';
/* other */
const COMBO_CLASS = 'dd__combo';
const VALUE_CLASS = 'dd__combo-value';
const CONTROLS_CLASS = 'dd__combo-controls';
const CLEAR_BTN_CLASS = 'dd__clear-btn';
const TOGGLE_BTN_CLASS = 'dd__toggle-btn';
const TOGGLE_ICON_CLASS = 'dd__toggle-icon';
const PLACEHOLDER_CLASS = 'dd__single-selection_placeholder';
const OPTION_WRAPPER_CLASS = 'dd__opt-wrapper';

/* List position constants */
const SCREEN_PADDING = 5;
const LIST_MARGIN = 5;
const ATTACH_REF_HEIGHT = 5;

/** Default properties */
const defaultProps = {
    name: undefined,
    form: undefined,
    multi: false,
    listAttach: false,
    enableFilter: false,
    noResultsMessage: 'No items',
    editable: false,
    disabled: false,
    useNativeSelect: false,
    fullScreen: false,
    placeholder: null,
    onItemSelect: null,
    onChange: null,
    onInput: null,
    className: null,
    ignoreScrollTimeout: 500,
    components: {
        ListItem: DropDownListItem,
        MultiSelectionItem: DropDownMultiSelectionItem,
    },
};

/**
 * Drop Down List constructor
 * @param {Object} props
 * @param {string|Element} props.elem - identifier or element to attach DropDown component to
 * @param {boolean} props.editable - if set true user will be able to type text in the combo box
 * @param {boolean} props.disabled - if set true any interactions with component will be disabled
 * @param {boolean} props.useNativeSelect - if set true component will use native select element on
 *     small devices(less 768px width) to view list and edit selection
 * @param {boolean} props.fullScreen - if set true component will show fullscreen popup
 * @param {string} props.placeholder - placeholder text for component
 * @param {Function} props.onItemSelect - item selected event handler
 * @param {Function} props.onChange - selection changed event handler
 * @param {boolean|Function} props.onInput - text input event handler
 *    If set to true list items will be filtered by input value
 * @param {Function} props.components.ListItem - custom list item component
 * @param {Function} props.components.MultiSelectionItem - custom selected item component
 * @param {string} props.className - additional CSS classes
 * @param {Object} props.data - array of item objects { id, title }
 */
export class DropDown extends Component {
    static userProps = {
        selectElem: ['name', 'form'],
    };

    constructor(props = {}) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
            components: {
                ...defaultProps.components,
                ...(this.props.components ?? {}),
            },
        };

        this.hostElem = this.elem;
        this.elem = null;
        if (!this.hostElem) {
            this.props.listAttach = false;
        }

        this.listItems = [];
        this.optGroups = [];
        this.selectionItems = [];

        this.state = {
            active: false,
            changed: false,
            visible: false,
            inputString: null,
            filtered: false,
            filteredCount: 0,
            editable: this.props.editable,
            disabled: this.props.disabled,
            items: [],
            groups: [],
            actSelItemIndex: -1,
            itemsChanged: false,
            blockScroll: false,
            listScroll: 0,
            focusedElem: null,
            blockTouch: false,
        };
        this.state.editable = !this.state.disabled && this.props.enableFilter;

        this.emptyClickHandler = () => this.showList(false);
        this.toggleEvents = { click: () => this.toggleList() };
        this.inputEvents = { input: (e) => this.onInput(e) };
        this.commonEvents = {
            focus: (e) => this.onFocus(e),
            blur: (e) => this.onBlur(e),
            keydown: (e) => this.onKey(e),
        };
        this.viewportEvents = { resize: (e) => this.onViewportResize(e) };
        this.scrollHandler = (e) => this.onWindowScroll(e);
        this.listeningWindow = false;

        if (this.props.listAttach) {
            this.attachToElement();
        } else {
            this.attachToInput();
        }

        this.setUserProps();
        this.setClassNames();

        if (this.props.useNativeSelect) {
            this.elem.classList.add(NATIVE_CLASS);
        }
        if (this.props.fullScreen) {
            this.elem.classList.add(FULLSCREEN_CLASS);

            this.backgroundElem = createElement('div', {
                props: { className: FULLSCREEN_BG_CLASS },
            });
            this.elem.append(this.backgroundElem);
        }

        this.createList();
        setEvents(this.selectElem, { change: (e) => this.onChange(e) });
        this.assignCommonHandlers(this.selectElem);

        if (!this.props.listAttach) {
            this.createCombo();
            this.elem.appendChild(this.comboElem);
        }

        this.makeEditable(this.state.editable);

        if (this.hostElem.tagName === 'SELECT') {
            this.parseSelect(this.selectElem);
        }

        if (this.props.data) {
            const newItems = this.createItems(this.props.data);
            this.state.items.push(...newItems);

            this.state.items = this.processSingleSelection(this.state.items);
        }

        this.render(this.state);
    }

    /** Return array of all list items */
    get items() {
        return [...this.state.items];
    }

    /** Return disabled state */
    get disabled() {
        return this.state.disabled;
    }

    /** Check specified element is in input elements group */
    isInputElement(elem) {
        const inputTags = ['INPUT', 'SELECT', 'TEXTAREA'];
        return elem && inputTags.includes(elem.tagName);
    }

    /** Attach DropDown component to specified input element */
    attachToInput() {
        if (!this.hostElem) {
            this.createSelect();
            this.hostElem = this.selectElem;
        }
        if (!this.isInputElement(this.hostElem)) {
            throw new Error('Invalid element specified');
        }

        // Create container
        this.elem = createElement('div', { props: { className: CONTAINER_CLASS } });

        if (this.hostElem.disabled) {
            this.state.disabled = true;
        }

        if (this.hostElem.tagName === 'SELECT') {
            this.selectElem = this.hostElem;
            if (this.selectElem.multiple) {
                this.props.multi = true;
            }

            if (this.selectElem.parentNode) {
                insertAfter(this.elem, this.selectElem);
            }
            this.createInput();
        } else {
            if (this.hostElem.parentNode) {
                insertAfter(this.elem, this.hostElem);
                this.inputElem = re(this.hostElem);
            } else {
                this.inputElem = this.hostElem;
            }

            this.createSelect();
        }
        this.elem.append(this.selectElem);

        if (this.props.multi) {
            this.selectElem.multiple = true;
            this.elem.classList.add(MULTIPLE_CLASS);
        }
    }

    /** Attach DropDown to specified element */
    attachToElement() {
        this.elem = createElement('div', { props: { className: ATTACHED_CLASS } });
        insertAfter(this.elem, this.hostElem);
        this.elem.append(this.hostElem);

        setEvents(this.hostElem, this.toggleEvents);

        this.createSelect();
        if (this.props.multi) {
            this.selectElem.multiple = true;
        }

        this.elem.append(this.hostElem, this.selectElem);

        return true;
    }

    /** Creates select element */
    createSelect() {
        this.selectElem = createElement('select');
    }

    /** Creates input element */
    createInput() {
        this.inputElem = createElement('input', { props: { type: 'text' } });
    }

    /** Creates list element */
    createList() {
        const children = [];

        if (this.props.listAttach && this.props.enableFilter) {
            this.createInput();
            children.push(this.inputElem);
        }

        this.listElem = createElement('ul', {
            events: {
                scroll: (e) => this.onScroll(e),
                touchstart: (e) => this.onTouchStart(e),
                mousemove: (e) => this.onMouseMove(e),
                click: (e) => this.onListItemClick(e),
            },
        });
        children.push(this.listElem);

        this.list = createElement('div', {
            props: { className: LIST_CLASS },
            children,
        });
        this.elem.append(this.list);
    }

    /** Create combo element and return if success */
    createCombo() {
        if (this.props.listAttach || !this.inputElem) {
            return;
        }

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
            this.clearBtn = CloseButton.create({
                className: CLEAR_BTN_CLASS,
                onClick: () => this.onClear(),
            });
            controls.append(this.clearBtn.elem);
        }
        this.createToggleButton();
        controls.append(this.toggleBtn);

        this.comboElem = createElement('div', {
            props: { className: COMBO_CLASS },
            children: [valueContainer, controls],
        });
    }

    /** Create toggle drop down button */
    createToggleButton() {
        const arrowIcon = createSVGElement('svg', {
            attrs: { class: TOGGLE_ICON_CLASS, viewBox: '0 0 3.7 3.7' },
            children: createSVGElement('path', { attrs: { d: TOGGLE_ICON } }),
        });
        this.toggleBtn = createElement('div', {
            props: { className: TOGGLE_BTN_CLASS },
            children: arrowIcon,
            events: this.toggleEvents,
        });
    }

    /* Event handlers */
    listenWindowEvents() {
        setTimeout(() => {
            this.ignoreScroll = false;
        }, this.props.ignoreScrollTimeout);

        if (this.listeningWindow) {
            return;
        }

        setEvents(window.visualViewport, this.viewportEvents);
        window.addEventListener('scroll', this.scrollHandler, { passive: true, capture: true });

        this.listeningWindow = true;
    }

    stopWindowEvents() {
        if (!this.listeningWindow) {
            return;
        }

        removeEvents(window.visualViewport, this.viewportEvents);
        window.removeEventListener('scroll', this.scrollHandler, { passive: true, capture: true });
        this.listeningWindow = false;
    }

    /** Add focus/blur event handlers to specified element */
    assignCommonHandlers(elem) {
        setEvents(elem, this.commonEvents);
    }

    /** Remove focus/blur event handlers from specified element */
    removeCommonHandlers(elem) {
        removeEvents(elem, this.commonEvents);
    }

    /** viewPort 'resize' event handler */
    onWindowScroll() {
        if (this.ignoreScroll) {
            return;
        }

        this.updateListPosition();
    }

    /** viewPort 'resize' event handler */
    onViewportResize() {
        this.updateListPosition();
    }

    /** List item 'click' event handler */
    onListItemClick(e) {
        e.stopPropagation();

        const item = this.getItemByElem(e.target);
        this.handleItemSelect(item);
    }

    /** Handler of 'change' event of native select */
    onChange() {
        if (!this.selectElem?.options) {
            return;
        }

        const selOptions = Array.from(this.selectElem.selectedOptions);
        const selValues = selOptions.map((option) => option.value);

        this.setState({
            ...this.state,
            items: this.state.items.map((item) => ({
                ...item,
                selected: selValues.includes(item.id),
            })),
        });

        this.sendItemSelectEvent();
        this.state.changed = true;
    }

    /** 'focus' event handler */
    onFocus(e) {
        if (this.state.disabled) {
            return;
        }

        this.activate(true);

        const index = this.getSelectedItemIndex(e.target);
        if (index !== -1) {
            this.activateSelectedItem(index);
        } else if (e.target === this.inputElem) {
            this.activateInput();
        }

        this.state.focusedElem = e.target;
    }

    /** 'blur' event handler */
    onBlur(e) {
        const lostFocus = !this.isChildTarget(e.relatedTarget);
        if (lostFocus) {
            this.activate(false);
        }

        if (e.target === this.selectElem) {
            this.sendChangeEvent();
        }

        this.state.focusedElem = null;
    }

    /** Click by delete button of selected item event handler */
    onDeleteSelectedItem(e) {
        if (!this.props.multi) {
            return;
        }
        const index = this.getSelectedItemIndex(e?.target);
        if (index === -1) {
            return;
        }

        const SelectionItemComponent = this.props.components.MultiSelectionItem;
        const isClick = (e.type === 'click');
        if (
            isClick
            && !e.target.closest(`.${SelectionItemComponent.buttonClass}`)
        ) {
            return;
        }

        const selectedItems = this.getSelectedItems();
        if (!selectedItems.length) {
            return;
        }

        const isBackspace = (e.type === 'keydown' && e.code === 'Backspace');
        let itemToActivate;
        if (isBackspace) {
            if (index === 0) {
                // Activate first selected item if available or focus host input otherwise
                itemToActivate = (selectedItems.length > 1) ? 0 : -1;
            } else {
                // Activate previous selected item
                itemToActivate = index - 1;
            }
        } else {
            // Focus input or container if deselect last(right) selected item
            // Activate next selected item otherwise
            itemToActivate = (isClick || index === selectedItems.length - 1) ? -1 : index;
        }
        this.activateSelectedItem(itemToActivate);

        const item = selectedItems[index];
        if (!item) {
            return;
        }

        this.deselectItem(item.id);
        this.sendItemSelectEvent();
        this.state.changed = true;
        this.sendChangeEvent();
    }

    /** 'scroll' event of list element handler */
    onScroll() {
        if (!this.state.blockScroll) {
            this.setActive(null);
        }

        this.state.blockScroll = false;
    }

    /** 'keydown' event handler */
    onKey(e) {
        let newItem = null;

        e.stopPropagation();

        const { editable } = this.state;
        const { multi } = this.props;

        // Backspace or Arrow Left key on container or text input
        // Activate last multiple selection item
        if (
            multi
            && (e.code === 'Backspace' || e.code === 'ArrowLeft')
            && (
                (editable && e.target === this.inputElem)
                || (!editable && e.target === this.elem)
            )
        ) {
            if (editable && e.currentTarget === this.inputElem) {
                // Check cursor is at start of input
                const cursorPos = getCursorPos(this.inputElem);
                if (cursorPos?.start !== 0 || cursorPos.start !== cursorPos.end) {
                    return;
                }
            }

            this.activateLastSelectedItem();
            return;
        }

        if (multi && (e.code === 'Backspace' || e.code === 'Delete')) {
            this.onDeleteSelectedItem(e);
            return;
        }

        if (multi && (e.code === 'ArrowLeft' || e.code === 'ArrowRight')) {
            this.onSelectionNavigate(e);
            return;
        }

        const activeItem = this.getActiveItem();

        if (e.code === 'ArrowDown') {
            const availItems = this.getAvailableItems(this.state);

            if (!this.state.visible && !activeItem) {
                this.showList(true);
                [newItem] = availItems;
            } else if (this.state.visible) {
                if (activeItem) {
                    newItem = this.getNextAvailableItem(activeItem.id);
                } else {
                    [newItem] = availItems;
                }
            }
        } else if (e.code === 'ArrowUp') {
            if (this.state.visible && activeItem) {
                newItem = this.getPrevAvailableItem(activeItem.id);
            }
        } else if (e.code === 'Home') {
            const availItems = this.getAvailableItems(this.state);
            if (availItems.length > 0) {
                [newItem] = availItems;
            }
        } else if (e.code === 'End') {
            const availItems = this.getAvailableItems(this.state);
            if (availItems.length > 0) {
                newItem = availItems[availItems.length - 1];
            }
        } else if (e.code === 'Enter') {
            this.handleItemSelect(activeItem);
            e.preventDefault();
        } else if (e.code === 'Escape') {
            this.showList(false);
            if (this.state.focusedElem) {
                this.state.focusedElem.blur();
            }
        } else {
            return;
        }

        if (newItem) {
            this.setActive(newItem);
            this.scrollToItem(newItem);
            e.preventDefault();
        }
    }

    /** Handler for left or right arrow keys */
    onSelectionNavigate(e) {
        if (!this.props.multi) {
            return;
        }

        const selectedItems = this.getSelectedItems();
        if (!selectedItems.length) {
            return;
        }

        const index = this.state.actSelItemIndex;
        if (e.code === 'ArrowLeft') {
            if (index === 0) {
                return;
            }
            if (index === -1) {
                this.activateLastSelectedItem();
                return;
            }

            this.activateSelectedItem(index - 1);
        } else {
            const itemToActivate = (index === selectedItems.length - 1) ? -1 : index + 1;
            this.activateSelectedItem(itemToActivate);
        }
    }

    /**
     * Handler for 'touchstart' event on list item
     * Set blockTouch flag for further 'mousemove' event
     * @param {TouchEvent} e - event object
     */
    onTouchStart(e) {
        if (e.touches) {
            this.state.blockTouch = true;
        }
    }

    /** Handler for 'mousemove' event on list item */
    onMouseMove(e) {
        if (this.state.blockScroll || this.state.blockTouch) {
            return;
        }

        const item = this.getItemByElem(e.target);
        if (!item || item.active) {
            return;
        }

        this.setActive(item);
    }

    /** Handler for 'input' event of text field  */
    onInput(e) {
        if (this.props.enableFilter) {
            this.filter(e.target.value);
        }

        if (isFunction(this.props.onInput)) {
            this.props.onInput(e);
        }
    }

    /** Handler for 'clear selection' button click */
    onClear() {
        if (!this.props.multi) {
            return;
        }

        this.setState({
            ...this.state,
            items: this.state.items.map((item) => ({
                ...item,
                selected: false,
            })),
            changed: true,
        });

        this.sendChangeEvent();
    }

    /** Handles user item select event */
    handleItemSelect(item) {
        if (!item || item.disabled) {
            return;
        }

        this.activateSelectedItem(-1);
        this.toggleItem(item.id);
        this.sendItemSelectEvent();
        this.state.changed = true;

        if (!this.props.multi) {
            this.state.inputString = null;
            this.showList(false);
            if (this.props.enableFilter && this.state.filtered) {
                this.showAllItems();
            }
        }

        if (!this.props.multi) {
            setTimeout(() => this.elem.focus());
        } else if (this.props.enableFilter) {
            setTimeout(() => this.inputElem.focus());
        }
    }

    /* List items methods */
    /** Return list item object by id */
    getItem(itemId, state = this.state) {
        const strId = itemId?.toString();
        return state.items.find((item) => item.id === strId);
    }

    /** Return active list item */
    getActiveItem(state = this.state) {
        return state.items.find((item) => item.active);
    }

    /** Return index of list item by id */
    getItemIndex(itemId, state = this.state) {
        const strId = itemId?.toString();
        return state.items.findIndex((item) => item.id === strId);
    }

    /**
     * Return previous list item to specified by id
     * @returns null in case specified list item is not found or on first position
     * @param {number} itemId - identifier of item to start looking from
     */
    getPrevItem(itemId) {
        const ind = this.getItemIndex(itemId);
        if (ind === -1) {
            return null;
        }

        if (ind > 0) {
            return this.state.items[ind - 1];
        }

        return null;
    }

    /**
     * Return next list item to specified by id
     * @returns null in case specified list item is not found or on last position
     * @param {number} itemId - identifier of item to start looking from
     */
    getNextItem(itemId) {
        const ind = this.getItemIndex(itemId);
        if (ind === -1) {
            return null;
        }

        if (ind < this.state.items.length) {
            return this.state.items[ind + 1];
        }

        return null;
    }

    /** Return array of visible(not hidden) list items */
    getVisibleItems(state = this.state) {
        return state.items.filter((item) => (
            (state.filtered)
                ? (item.matchFilter && !item.hidden)
                : !item.hidden
        ));
    }

    isAvailableItem(item, state = this.state) {
        return (
            !!item
            && !item.hidden
            && !item.disabled
            && ((state.filtered) ? item.matchFilter : true)
        );
    }

    /** Return array of visible and enabled list items */
    getAvailableItems(state = this.state) {
        return state.items.filter((item) => this.isAvailableItem(item, state));
    }

    /**
     * Return list item available to select prior to specified item
     * @returns null in case specified list item is not found or on first position
     * @param {number} itemId - identifier of item to start looking from
     */
    getPrevAvailableItem(itemId) {
        let item = this.getItem(itemId);
        while (item) {
            item = this.getPrevItem(item.id);
            if (this.isAvailableItem(item)) {
                return item;
            }
        }

        return null;
    }

    /**
     * Return list item available to select next to specified item
     * @returns null in case specified list item is not found or on last position
     * @param {number} itemId - identifier of item to start looking from
     */
    getNextAvailableItem(itemId) {
        let item = this.getItem(itemId);
        while (item) {
            item = this.getNextItem(item.id);
            if (this.isAvailableItem(item)) {
                return item;
            }
        }

        return null;
    }

    /** Return array of selected items */
    getSelectedItems(state = this.state) {
        return state?.items?.filter((item) => item?.selected);
    }

    /** Return list item object which list element contains specified element */
    getItemByElem(elem) {
        const li = elem?.closest('li');
        if (!li) {
            return null;
        }
        return this.getItem(li.dataset.id);
    }

    /** Returns list element for specified item id */
    getListItemElem(id) {
        return this.listElem.querySelector(`[data-id="${id}"]`);
    }

    /** Show or hide drop down list */
    showList(val) {
        if (this.state.visible === val) {
            return;
        }

        // Deactivate all list items on hide list
        const newItems = (val)
            ? this.state.items
            : this.state.items.map((item) => ({ ...item, active: false }));

        this.setState({
            ...this.state,
            visible: val,
            active: (val) ? true : this.state.active,
            items: newItems,
        });

        if (val) {
            setEmptyClick(
                this.emptyClickHandler,
                [this.inputElem, this.staticElem, this.comboElem, this.list, this.toggleBtn],
            );

            if (!this.state.editable && this.toggleBtn) {
                setTimeout(() => this.toggleBtn.focus());
            }
        } else {
            removeEmptyClick(this.emptyClickHandler);

            this.sendChangeEvent();
        }
    }

    /** Enable/disable text input at combo element  */
    makeEditable(editable = true) {
        if (this.props.listAttach && !this.props.enableFilter) {
            return;
        }

        this.state.editable = editable;

        if (this.props.placeholder) {
            this.inputElem.placeholder = this.props.placeholder;
        }

        show(this.staticElem, !this.state.editable);
        show(this.inputElem, this.state.editable);

        this.elem.classList.toggle(EDITABLE_CLASS, !!this.state.editable);
        this.inputElem.classList.toggle(INPUT_CLASS, !!this.state.editable);
        if (this.state.editable) {
            setEvents(this.inputElem, this.inputEvents);
            if (this.staticElem) {
                this.inputElem.value = this.staticElem.textContent;
            }
            this.assignCommonHandlers(this.inputElem);
            this.inputElem.autocomplete = 'off';
        } else {
            this.removeCommonHandlers(this.inputElem);
            removeEvents(this.inputElem, this.inputEvents);

            if (!this.staticElem) {
                return;
            }

            const content = (this.props.placeholder && this.inputElem.value.length === 0)
                ? this.props.placeholder
                : this.inputElem.value;
            this.staticElem.textContent = content;

            setEvents(this.staticElem, this.toggleEvents);
        }
    }

    /** Setup tabindexes of component */
    setTabIndexes(state) {
        if (state.disabled) {
            this.elem.removeAttribute('tabindex');
            if (this.inputElem) {
                this.inputElem.removeAttribute('tabindex');
            }
            this.selectElem.removeAttribute('tabindex');
        } else if (isVisible(this.selectElem, true)) {
            this.selectElem.setAttribute('tabindex', 0);
            this.elem.setAttribute('tabindex', -1);
            if (this.inputElem) {
                this.inputElem.setAttribute('tabindex', (state.editable) ? 0 : -1);
            }
        } else {
            this.selectElem.setAttribute('tabindex', -1);
            this.elem.setAttribute('tabindex', (state.editable) ? -1 : 0);
            if (this.inputElem) {
                this.inputElem.setAttribute('tabindex', (state.editable) ? 0 : -1);
            }
        }
    }

    /** Enable or disable component */
    enable(val = true) {
        if (val !== this.state.disabled) {
            return;
        }

        this.setState({
            ...this.state,
            disabled: !val,
            active: false,
        });
    }

    /** Show drop down list if hidden or hide if visible */
    toggleList() {
        if (!this.list || !this.listElem || this.state.disabled) {
            return;
        }
        // Flush filter
        if (!this.state.visible && this.state.filtered) {
            this.showAllItems();
        }

        this.showList(!this.state.visible);
    }

    /** Activate or deactivate component */
    activate(val) {
        if (this.state.active === val) {
            return;
        }

        if (!val) {
            this.showList(false);
        }

        this.setState({
            ...this.state,
            active: val,
            actSelItemIndex: -1,
            filtered: false,
            filteredCount: 0,
            inputString: null,
            items: this.state.items.map((item) => ({
                ...item,
                active: false,
            })),
        });
    }

    activateInput() {
        if (!this.state.editable || !this.props.enableFilter || this.state.disabled) {
            return;
        }

        const newState = {
            ...this.state,
            actSelItemIndex: -1,
            items: this.state.items.map((item) => ({
                ...item,
                active: false,
            })),
        };

        if (this.state.inputString === null) {
            newState.inputString = '';
            newState.filtered = false;
            newState.filteredCount = 0;
        }

        this.setState(newState);
    }

    /** Check specified element is child of some selected item element */
    isSelectedItemElement(elem) {
        return elem && this.selectionElem?.contains(elem);
    }

    /** Check specified element is child of component */
    isChildTarget(elem) {
        return elem && this.elem.contains(elem);
    }

    getSelectionItemById(itemId) {
        const strId = itemId?.toString();
        return this.selectionItems.find((item) => item.id === strId);
    }

    /** Render selection elements */
    renderSelection(state, prevState) {
        this.renderSingleSelection(state);
        if (this.props.listAttach || !this.props.multi) {
            return;
        }

        const prevSelectedItems = this.getSelectedItems(prevState);
        const selectedItems = this.getSelectedItems(state);
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
                    this.assignCommonHandlers(selItem.elem);
                }

                selectionItems.push(selItem);
            });

            // Remove items not included in new state
            this.selectionItems.forEach((item) => {
                if (selectionItems.includes(item)) {
                    return;
                }

                // Remove input handlers to avoid 'blur' event on remove element
                this.removeCommonHandlers(item.elem);
                re(item.elem);
            });

            this.selectionItems = selectionItems;

            show(this.selectionElem, selectedItems.length > 0);
            this.clearBtn?.show(selectedItems.length > 0);
        }

        setTimeout(() => {
            if (this.state.disabled || !this.state.active || this.state.actSelItemIndex === -1) {
                return;
            }

            const item = this.selectionItems[this.state.actSelItemIndex];
            item?.elem?.focus();
        });
    }

    /** Return selected items data for 'itemselect' and 'change' events */
    getSelectionData() {
        const selectedItems = this.getSelectedItems()
            .map((item) => ({ id: item.id, value: item.title }));

        if (this.props.multi) {
            return selectedItems;
        }

        return (selectedItems.length > 0) ? selectedItems[0] : null;
    }

    /** Send current selection data to 'itemselect' event handler */
    sendItemSelectEvent() {
        if (isFunction(this.props.onItemSelect)) {
            const data = this.getSelectionData();
            this.props.onItemSelect(data);
        }
    }

    /**
     * Send current selection data to 'change' event handler
     * 'change' event occurs after user finnished selection of item(s) and list was hidden
     */
    sendChangeEvent() {
        if (!this.state.changed) {
            return;
        }

        if (isFunction(this.props.onChange)) {
            const data = this.getSelectionData();
            this.props.onChange(data);
        }

        this.state.changed = false;
    }

    /** Toggle item selected status */
    toggleItem(itemId) {
        const item = this.getItem(itemId);
        if (!item) {
            return;
        }

        if (item.selected && this.props.multi) {
            this.deselectItem(itemId);
        } else {
            this.selectItem(itemId);
        }
    }

    /** Select specified item */
    selectItem(itemId) {
        const strId = itemId?.toString();
        const itemToSelect = this.getItem(strId);
        if (!itemToSelect || itemToSelect.selected) {
            return;
        }

        this.setState({
            ...this.state,
            items: this.state.items.map((item) => ({
                ...item,
                selected: (this.props.multi)
                    ? (item.selected || item.id === strId)
                    : (item.id === strId),
            })),
        });
    }

    /** Deselect specified item */
    deselectItem(itemId) {
        if (!this.props.multi) {
            return;
        }

        const strId = itemId?.toString();
        const itemToDeselect = this.getItem(strId);
        if (!itemToDeselect?.selected) {
            return;
        }

        this.setState({
            ...this.state,
            items: this.state.items.map((item) => ({
                ...item,
                selected: item.selected && item.id !== strId,
            })),
        });
    }

    /** Sets items selection */
    setSelection(ids) {
        const itemIds = asArray(ids).map((id) => id?.toString());
        if (!this.props.multi && itemIds.length !== 1) {
            return;
        }

        this.setState({
            ...this.state,
            items: this.state.items.map((item) => ({
                ...item,
                selected: itemIds.includes(item.id),
            })),
        });
    }

    /** Return index of selected item contains specified element */
    getSelectedItemIndex(elem) {
        const SelectionItemComponent = this.props.components.MultiSelectionItem;
        const selItemElem = elem?.closest(`.${SelectionItemComponent.className}`);
        if (!selItemElem) {
            return -1;
        }

        const selectedItems = this.getSelectedItems();
        if (!Array.isArray(selectedItems)) {
            return -1;
        }

        return selectedItems.findIndex((item) => item.id === selItemElem.dataset.id);
    }

    /** Activate specified selected item */
    activateSelectedItem(index) {
        if (this.state.disabled || !this.props.multi) {
            return;
        }

        // Check correctness of index
        if (index !== -1) {
            const selectedItems = this.getSelectedItems();
            if (index < 0 || index >= selectedItems.length) {
                return;
            }
        }

        this.setState({
            ...this.state,
            actSelItemIndex: index,
            items: (
                (index === -1)
                    ? this.state.items
                    : this.state.items.map((item) => ({
                        ...item,
                        active: false,
                    }))
            ),
        });

        if (this.state.actSelItemIndex === -1) {
            setTimeout(() => {
                if (this.props.enableFilter) {
                    this.inputElem.focus();
                } else {
                    this.elem.focus();
                }
            });
        }
    }

    /** Activate last(right) selected item */
    activateLastSelectedItem() {
        const selectedItems = this.getSelectedItems();
        if (!selectedItems.length) {
            return;
        }

        this.activateSelectedItem(selectedItems.length - 1);
    }

    /** Show all list items */
    showAllItems() {
        this.setState({
            ...this.state,
            filtered: false,
            filteredCount: 0,
            items: this.state.items.map((item) => ({
                ...item,
                active: false,
            })),
        });
    }

    /** Show only items containing specified string */
    filter(fstr) {
        if (this.state.inputString === fstr) {
            return;
        }

        this.state.inputString = fstr;

        if (fstr.length === 0) {
            this.showAllItems();
            return;
        }

        const lfstr = fstr.toLowerCase();
        const filteredItems = this.state.items.filter(
            (item) => item.title.toLowerCase().includes(lfstr),
        );
        const filteredIds = filteredItems.map((item) => item.id);
        const items = this.state.items.map((item) => ({
            ...item,
            matchFilter: filteredIds.includes(item.id),
            active: false,
        }));

        this.setState({
            ...this.state,
            filtered: true,
            filteredCount: filteredItems.length,
            visible: true,
            items,
        });
    }

    /**
     * Fix multiple select issues on iOS safari
     * @param {Element} elem - select element
     */
    fixIOS(elem) {
        if (!elem || elem.tagName !== 'SELECT' || !this.props.multi) {
            return;
        }

        const firstElement = elem.firstElementChild;
        if (firstElement
            && firstElement.tagName === 'OPTGROUP'
            && firstElement.hidden
            && firstElement.disabled) {
            return;
        }

        const optgroup = createElement('optgroup', {
            props: { hidden: true, disabled: true },
        });
        prependChild(elem, optgroup);
    }

    /**
     * Parse specified option element and create new list item
     * @returns {Object|null} result list item object
     * @param {Element} option - option element to parse
     * @param {Object|null} group - option group object
     */
    parseOption(option, group = null) {
        if (!option) {
            return null;
        }

        const item = this.createItem({
            id: option.value,
            title: option.textContent,
            group,
            selected: option.selected,
            disabled: option.disabled,
        });

        return item;
    }

    /** Parse select element and create list items from child options */
    parseSelect(elem) {
        if (!elem || elem.tagName !== 'SELECT' || !elem.options) {
            return false;
        }

        for (let i = 0, l = elem.children.length; i < l; i += 1) {
            const childElem = elem.children[i];
            if (childElem.tagName === 'OPTGROUP') {
                const group = this.createGroup(childElem.label);
                if (!group) {
                    return false;
                }
                this.state.groups.push(group);

                for (let ci = 0, cl = childElem.children.length; ci < cl; ci += 1) {
                    const groupChild = childElem.children[ci];
                    const item = this.parseOption(groupChild, group);
                    if (!item) {
                        return false;
                    }
                    this.state.items.push(item);
                }
            } else if (childElem.tagName === 'OPTION') {
                const item = this.parseOption(childElem, null);
                if (!item) {
                    return false;
                }
                this.state.items.push(item);
            }
        }

        // For single select check only one item is selected
        if (!this.props.multi) {
            this.state.items = this.state.items.map((item, ind) => ({
                ...item,
                selected: ind === elem.selectedIndex,
            }));
        }

        return true;
    }

    /**
     * Create items from specified array
     * @param {Object|Object[]} items
     */
    createItems(items) {
        if (!items) {
            return null;
        }

        const data = asArray(items);
        return data.map((item) => this.createItem(item));
    }

    /**
     * Append new item(s) to the end of list
     * @param {Object|Object[]} items
     */
    append(items) {
        const newItems = this.createItems(items);
        if (!newItems || !this.list || !this.listElem) {
            return false;
        }

        this.setState({
            ...this.state,
            items: [
                ...this.state.items,
                ...newItems,
            ],
        });

        return true;
    }

    /** Returns option element */
    createOption(item) {
        const optionProps = {
            props: {
                value: item.id,
                textContent: item.title,
                selected: item.selected,
            },
        };
        if (item.disabled) {
            optionProps.attrs = { disabled: '' };
        }

        const option = createElement('option', optionProps);

        if (item.hidden) {
            return createElement('div', {
                props: { className: OPTION_WRAPPER_CLASS },
                children: option,
            });
        }

        return option;
    }

    /** Returns option group element */
    createOptGroup(label, disabled = false) {
        const groupProps = { props: { label } };
        if (disabled) {
            groupProps.attrs = { disabled: '' };
        }

        const optGroup = createElement('optgroup', groupProps);
        return optGroup;
    }

    /**
     * Create new list item
     * @param {Object} props
     * @param {string} props.id - identifier of new list item
     * @param {string} props.title - title of list item
     * @param {bool} props.selected - selected flag
     * @param {string} props.group - optional target group identifier
     * @param {string} props.disabled - optional disabled item flag
     */
    addItem(props) {
        const newItem = this.createItem(props);
        if (!newItem) {
            return;
        }

        const items = [...this.state.items];
        const lastGroupItemInd = (newItem.group)
            ? items.findLastIndex((item) => item.group === newItem.group)
            : -1;
        if (lastGroupItemInd !== -1) {
            items.splice(lastGroupItemInd + 1, 0, newItem);
        } else {
            items.push(newItem);
        }

        const newItems = this.processSingleSelection(items);
        this.setState({
            ...this.state,
            items: newItems,
        });
    }

    /** Returns new item object */
    createItem(props = {}) {
        const id = props?.id ?? null;
        if (id === null) {
            throw new Error('Invalid item id');
        }
        const item = this.getItem(id);
        if (item) {
            throw new Error('Item already exist');
        }

        const defaultItemProps = {
            selected: false,
            hidden: false,
            disabled: false,
            group: null,
        };

        const res = {
            ...defaultItemProps,
            ...props,
            id: props.id.toString(),
            active: false,
        };

        return res;
    }

    /**
     * Create new group
     * @param {string} label
     */
    addGroup(label, disabled = false) {
        const group = this.createGroup(label, disabled);
        if (!group) {
            return null;
        }

        this.state.groups.push(group);

        return group;
    }

    /** Render list group element */
    renderGroupItem(group) {
        const listElem = createElement('ul');
        const res = {
            listElem,
            elem: createElement('div', {
                props: { className: LIST_GROUP_CLASS },
                children: [
                    createElement('div', {
                        props: {
                            className: LIST_GROUP_LABEL_CLASS,
                            textContent: group.title,
                        },
                    }),
                    listElem,
                ],
            }),
        };

        return res;
    }

    /**
     * Create new group
     * @param {string} label
     */
    createGroup(title, disabled = false) {
        const group = {
            title,
            disabled,
        };

        return group;
    }

    /** Remove item by id */
    removeItem(itemId) {
        const itemIndex = this.getItemIndex(itemId);
        if (itemIndex === -1) {
            return;
        }

        this.setState({
            ...this.state,
            items: this.state.items.filter((_, index) => (index !== itemIndex)),
        });
    }

    /** Remove all items */
    removeAll() {
        this.setState({
            ...this.state,
            items: [],
        });
    }

    /** Set active state for specified list item */
    setActive(itemToActivate) {
        const activeItem = this.getActiveItem();
        if (
            (activeItem === itemToActivate)
            || (!activeItem && !itemToActivate)
        ) {
            return;
        }

        this.setState({
            ...this.state,
            actSelItemIndex: -1,
            items: this.state.items.map((item) => ({
                ...item,
                active: item === itemToActivate,
            })),
        });
    }

    /** Enable/disable list item by id */
    enableItem(itemId, val) {
        const strId = itemId?.toString();
        const actionItem = this.getItem(strId);
        const toDisable = !val;
        if (!actionItem || actionItem.disabled === toDisable) {
            return;
        }

        this.setState({
            ...this.state,
            items: this.state.items.map((item) => ({
                ...item,
                disabled: (item.id === strId) ? toDisable : item.disabled,
                active: (item.id === strId && toDisable) ? false : item.active,
            })),
        });
    }

    /** Scroll list element until specified list item be fully visible */
    scrollToItem(item) {
        if (
            !item
            || item.hidden /* item must exist and be visible */
            || !this.state.visible /* drop down list must be visible */
        ) {
            return;
        }

        const elem = this.getListItemElem(item.id);
        if (!elem) {
            return;
        }

        const itemTop = elem.offsetTop;
        const itemBottom = itemTop + elem.offsetHeight;
        const listTop = this.listElem.scrollTop;
        const listHeight = this.list.clientHeight;
        const listBottom = listTop + listHeight;

        if (itemTop < listTop) {
            /* scroll up : decrease scroll top */
            this.state.blockScroll = true;
            this.state.listScroll = Math.min(this.listElem.scrollHeight, itemTop);
            this.listElem.scrollTop = this.state.listScroll;
        } else if (itemBottom > listBottom) {
            /* scroll down : increase scroll top */
            this.state.blockScroll = true;
            this.state.listScroll = Math.min(
                this.listElem.scrollHeight,
                listTop + itemBottom - listBottom,
            );
            this.listElem.scrollTop = this.state.listScroll;
        }

        setTimeout(() => {
            this.state.blockScroll = false;
        }, 200);
    }

    /**
     * Search for last selected item to leave selection only on it
     * If not found select first item
     * @param {Array} items
     * @returns
     */
    processSingleSelection(items) {
        if (this.props.multi) {
            return items;
        }

        let selectedInd = items.findLastIndex((item) => item.selected);
        if (selectedInd === -1) {
            selectedInd = 0;
        }
        return items.map((item, ind) => ({
            ...item,
            selected: ind === selectedInd,
        }));
    }

    /** Set text for single selection */
    renderSingleSelection(state) {
        if (this.props.multi) {
            if (state.editable) {
                this.inputElem.placeholder = this.props.placeholder;
                if (state.inputString == null) {
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

        const [selectedItem] = this.getSelectedItems(state);
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

    getGroupItems(state, group) {
        return state.items.filter((item) => item && item.group === group);
    }

    isVisibleGroup(state, group) {
        const items = this.getGroupItems(state, group);
        return items.some((item) => (
            !item.hidden && (!state.filtered || (state.filtered && item.matchFilter))
        ));
    }

    renderSelect(state) {
        const optGroups = [];
        const options = [];

        state.items.forEach((item) => {
            const option = this.createOption(item);

            if (item.group) {
                let group = optGroups.find((groupItem) => groupItem.group === item.group);
                if (!group) {
                    group = {
                        group: item.group,
                        elem: this.createOptGroup(item.group.title, item.group.disabled),
                    };
                    optGroups.push(group);
                    options.push(group.elem);
                }
                group.elem.append(option);
            } else {
                options.push(option);
            }
        });

        removeChilds(this.selectElem);
        this.fixIOS(this.selectElem);
        this.selectElem.append(...options);
    }

    getListItemById(itemId) {
        const strId = itemId?.toString();
        return this.listItems.find((item) => item.id === strId);
    }

    /** Render list item element */
    renderItem(props) {
        const ListItemComponent = this.props.components.ListItem;
        const item = ListItemComponent.create(props);

        item.elem.setAttribute('data-id', item.id);

        return item;
    }

    renderNotFound() {
        if (!this.notFoundElem) {
            const contentElem = createElement('div', {
                props: {
                    className: NOT_FOUND_CLASS,
                    textContent: this.props.noResultsMessage,
                },
            });
            this.notFoundElem = createElement('li', { children: contentElem });

            this.listElem.append(this.notFoundElem);
        }

        show(this.notFoundElem, true);
    }

    renderListContent(state, prevState) {
        const optGroups = [];
        const listItems = [];
        let lastItem = null;
        let lastGroupElem = null;
        let lastItemElem = null;

        if (state.items === prevState.items) {
            return;
        }

        if (state.filtered && state.filteredCount === 0) {
            this.renderNotFound();
        } else {
            show(this.notFoundElem, false);
        }

        state.items.forEach((item) => {
            const itemProps = {
                ...item,
                multi: this.props.multi,
            };

            let itemContainer = this.listElem;
            let listItem = this.getListItemById(item.id);
            const isNewItem = !listItem;
            if (listItem) {
                listItem.setState(itemProps);
            } else {
                listItem = this.renderItem(itemProps);
            }

            listItems.push(listItem);

            if (state.filtered) {
                show(listItem.elem, item.matchFilter && !item.hidden);
            } else {
                show(listItem.elem, !item.hidden);
            }

            const groupChanged = (lastItem?.group !== item.group);
            if (item.group) {
                let group = optGroups.find((groupItem) => groupItem.group === item.group);
                if (!group) {
                    group = this.optGroups.find((groupItem) => groupItem.group === item.group);
                }
                if (!group) {
                    group = {
                        group: item.group,
                        elems: this.renderGroupItem(item.group),
                    };

                    const lastElem = (lastItem?.group && groupChanged)
                        ? lastGroupElem
                        : lastItemElem;
                    if (lastElem) {
                        insertAfter(group.elems.elem, lastElem);
                    } else {
                        this.listElem.append(group.elems.elem);
                    }
                    if (groupChanged) {
                        lastItemElem = null;
                    }
                }
                if (!optGroups.includes(group)) {
                    optGroups.push(group);
                    show(group.elems.elem, this.isVisibleGroup(state, item.group));
                }
                lastGroupElem = group.elems.elem;
                itemContainer = group.elems.listElem;
            }

            if (isNewItem) {
                if (lastItemElem && !groupChanged) {
                    insertAfter(listItem.elem, lastItemElem);
                } else {
                    itemContainer.append(listItem.elem);
                }
            }

            lastItemElem = listItem.elem;
            lastItem = item;
        });

        // Remove items not included in new state
        this.listItems.forEach((item) => {
            if (!listItems.includes(item)) {
                re(item.elem);
            }
        });
        // Remove groups not included in new state
        this.optGroups.forEach((item) => {
            if (!optGroups.includes(item)) {
                re(item.elem);
            }
        });

        this.listItems = listItems;
        this.optGroups = optGroups;
    }

    renderFullscreenList(state) {
        if (!state.visible || this.props.listAttach) {
            return;
        }

        const html = document.documentElement;
        const combo = getOffset(this.comboElem);
        combo.width = this.comboElem.offsetWidth;
        combo.height = this.comboElem.offsetHeight;
        const offset = getOffset(this.list.offsetParent);

        document.body.style.overflow = 'hidden';

        this.list.style.left = px(combo.left);
        this.list.style.top = px(combo.top - offset.top + combo.height);

        this.list.style.minWidth = px(combo.width);
        this.list.style.width = '';

        const fullScreenListHeight = html.clientHeight - combo.height;
        this.list.style.height = px(fullScreenListHeight / 2);
    }

    updateListPosition() {
        if (
            !this.state.visible
            || isVisible(this.selectElem, true)
            || (this.props.fullScreen && isVisible(this.backgroundElem))
        ) {
            return;
        }

        setTimeout(() => {
            PopupPosition.calculate({
                elem: this.list,
                refElem: this.elem,
                margin: LIST_MARGIN,
                screenPadding: SCREEN_PADDING,
                useRefWidth: true,
                minRefHeight: this.getMinRefHeight(),
                scrollOnOverflow: false,
                allowResize: false,
            });
        }, 100);
    }

    getMinRefHeight() {
        if (this.props.listAttach) {
            return ATTACH_REF_HEIGHT;
        }

        const borderWidth = this.comboElem.offsetHeight - this.comboElem.clientHeight;
        return this.toggleBtn.offsetHeight + borderWidth;
    }

    renderList(state, prevState) {
        // Skip render if currently native select is visible
        if (isVisible(this.selectElem, true)) {
            return;
        }

        this.renderListContent(state, prevState);

        this.elem.classList.toggle(LIST_OPEN_CLASS, state.visible);

        if (!state.visible) {
            if (this.props.fullScreen) {
                document.body.style.overflow = '';
            }

            PopupPosition.reset(this.list);
            this.stopWindowEvents();
            return;
        }

        if (this.props.fullScreen && isVisible(this.backgroundElem)) {
            this.renderFullscreenList(state, prevState);
        } else {
            this.ignoreScroll = true;

            PopupPosition.calculate({
                elem: this.list,
                refElem: this.elem,
                margin: LIST_MARGIN,
                screenPadding: SCREEN_PADDING,
                useRefWidth: true,
                minRefHeight: this.getMinRefHeight(),
                scrollOnOverflow: true,
                onScrollDone: () => this.listenWindowEvents(),
            });
        }

        if (!prevState.visible) {
            this.listElem.scrollTop = 0;

            if (this.props.enableFilter) {
                setTimeout(() => {
                    this.inputElem.focus();
                });
            }
        }
    }

    render(state, prevState = {}) {
        this.elem.classList.toggle(ACTIVE_CLASS, !!state.active);

        if (state.disabled !== prevState?.disabled) {
            enable(this.elem, !state.disabled);
            if (state.disabled) {
                this.removeCommonHandlers(this.elem);
            } else {
                this.assignCommonHandlers(this.elem);
            }

            enable(this.selectElem, !state.disabled);
            enable(this.inputElem, !state.disabled);
            this.clearBtn?.enable(!state.disabled);
            enable(this.toggleBtn, !state.disabled);
        }

        this.setTabIndexes(state);
        this.renderSelection(state, prevState);
        this.renderSelect(state, prevState);
        this.renderList(state, prevState);
    }
}
