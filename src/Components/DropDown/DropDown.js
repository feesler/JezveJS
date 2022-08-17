import {
    isFunction,
    ce,
    svg,
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
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './style.scss';

/* Icons */
const CLOSE_ICON = 'M 1.1415,2.4266 5.7838,7 1.1415,11.5356 2.4644,12.8585 7,8.2162 11.5734,12.8585 12.8585,11.5356 8.2162,7 12.8585,2.4266 11.5734,1.1415 7,5.7838 2.4644,1.1415 Z';
const CHECK_ICON = 'M1.08 4.93a.28.28 0 000 .4l2.35 2.34c.1.11.29.11.4 0l4.59-4.59a.28.28 0 000-.4l-.6-.6a.28.28 0 00-.4 0l-3.8 3.8-1.54-1.55a.28.28 0 00-.4 0z';
const TOGGLE_ICON = 'm5.5 12 6.5 6 6.5-6z';

/* CSS classes */
/* Container */
const CONTAINER_CLASS = 'dd__container';
const MULTIPLE_CLASS = 'dd__container_multiple';
const ACTIVE_CLASS = 'dd__container_active';
const ATTACHED_CLASS = 'dd__container_attached';
const DISABLED_CLASS = 'dd__container_disabled';
const ENABLED_CLASS = 'dd__container_enabled';
const NATIVE_CLASS = 'dd__container_native';
const FULLSCREEN_CLASS = 'dd__fullscreen';
const FULLSCREEN_BG_CLASS = 'dd__background';
/* Selection */
const SELECTION_CLASS = 'dd__selection';
const SINGLE_SELECTION_CLASS = 'dd__single-selection';
/* Selection item */
const SELECTION_ITEM_CLASS = 'dd__selection-item';
const SELECTION_ITEM_ACTIVE_CLASS = 'dd__selection-item_active';
const SELECTION_ITEM_DEL_BTN_CLASS = 'dd__del-selection-item-btn';
/* List */
const LIST_CLASS = 'dd__list';
const LIST_ITEM_CLASS = 'dd__list-item';
const LIST_ITEM_ACTIVE_CLASS = 'dd__list-item_active';
const SELECTED_LIST_ITEM_CLASS = 'dd__list-item_selected';
const LIST_OPEN_CLASS = 'dd__open';
const LIST_DROP_DOWN_CLASS = 'dd__list_drop-down';
const LIST_DROP_UP_CLASS = 'dd__list_drop-up';
const LIST_GROUP_CLASS = 'dd__list-group';
const CHECK_ICON_CLASS = 'dd__check-icon';
/* other */
const COMBO_CLASS = 'dd__combo';
const CLEAR_BTN_CLASS = 'dd__clear-btn';
const CLEAR_ICON_CLASS = 'dd__clear-icon';
const TOGGLE_BTN_CLASS = 'dd__toggle-btn';
const TOGGLE_ICON_CLASS = 'dd__toggle-icon';
const PLACEHOLDER_CLASS = 'dd__single-selection_placeholder';
const OPTION_WRAPPER_CLASS = 'dd__opt-wrapper';

/** Default properties */
const defaultProps = {
    multi: false,
    listAttach: false,
    enableFilter: false,
    editable: false,
    disabled: false,
    useNativeSelect: false,
    fullScreen: false,
    placeholder: null,
    onitemselect: null,
    onchange: null,
    oninput: null,
    maxHeight: 5,
    className: null,
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
 * @param {number} props.maxHeight - maximum count of items to show in drop down list
 * @param {Function} props.onitemselect - item selected event handler
 * @param {Function} props.onchange - selection changed event handler
 * @param {boolean|Function} props.oninput - text input event handler
 *    If set to true list items will be filtered by input value
 * @param {Function} props.renderItem - callback for custom list item render
 * @param {Function} props.renderSelectionItem - callback for custom selected item render
 * @param {string} props.className - additional CSS classes
 * @param {Object} props.data - array of item objects { id, title }
 */
export class DropDown extends Component {
    /** Static alias for DropDown constructor */
    static create(params) {
        try {
            return new DropDown(params);
        } catch (e) {
            return null;
        }
    }

    constructor(props = {}) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        if (!this.props.elem) {
            throw new Error('Element not specified');
        }
        if (!this.elem || !this.elem.parentNode) {
            throw new Error('Invalid element specified');
        }
        this.hostElem = this.elem;
        this.elem = null;

        this.state = {
            active: false,
            changed: false,
            visible: false,
            inputString: null,
            filtered: false,
            filteredCount: 0,
            manFilter: false,
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

        if (this.state.disabled) {
            this.state.editable = false;
        }

        this.setMaxHeight(this.props.maxHeight);

        if ('renderItem' in this.props) {
            if (!isFunction(this.props.renderItem)) {
                throw new Error('Invalid renderItem handler specified');
            }
            this.renderItemCallback = this.props.renderItem;
        }
        if ('renderSelectionItem' in this.props) {
            if (!isFunction(this.props.renderSelectionItem)) {
                throw new Error('Invalid renderSelectionItem handler specified');
            }
            this.renderSelectionItemCallback = this.props.renderSelectionItem;
        }

        this.emptyClickHandler = () => this.showList(false);
        this.toggleHandler = () => this.toggleList();
        this.inputHandler = (e) => this.onInput(e);
        this.touchStartHandler = (e) => this.onTouchStart(e);
        this.moveHandler = (e) => this.onMouseMove(e);
        this.inpHandlers = {
            focus: (e) => this.onFocus(e),
            blur: (e) => this.onBlur(e),
            keydown: (e) => this.onKey(e),
        };

        if (this.props.listAttach) {
            this.attachToElement();
        } else {
            this.attachToInput();
        }

        if (!this.state.disabled) {
            this.assignInputHandlers(this.elem);
        }

        this.selectElem.tabIndex = -1;

        this.setClassNames();

        if (this.props.useNativeSelect) {
            this.elem.classList.add(NATIVE_CLASS);
        }
        if (this.props.fullScreen) {
            this.elem.classList.add(FULLSCREEN_CLASS);

            this.backgroundElem = ce('div', { className: FULLSCREEN_BG_CLASS });
            this.elem.appendChild(this.backgroundElem);
        }

        this.listElem = ce('ul', {}, null, { scroll: (e) => this.onScroll(e) });
        this.list = ce(
            'div',
            { className: LIST_CLASS },
            this.listElem,
        );

        this.elem.appendChild(this.list);

        this.selectElem.addEventListener('change', (e) => this.onChange(e));
        this.assignInputHandlers(this.selectElem);

        if (this.state.disabled) {
            this.selectElem.disabled = true;
        }

        if (!this.props.listAttach) {
            this.comboElem = this.createCombo();
            if (!this.comboElem) {
                throw new Error('Fail to create combo element');
            }
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

    /** Set maximum height of list element as count of items to be visible */
    setMaxHeight(value) {
        const maxHeight = parseInt(value, 10);
        if (Number.isNaN(maxHeight) || maxHeight <= 0) {
            throw new Error('Invalid maxHeight parameter');
        }
        this.state.maxHeight = maxHeight;
    }

    /** Check specified element is in input elements group */
    isInputElement(elem) {
        const inputTags = ['INPUT', 'SELECT', 'TEXTAREA'];
        return elem && inputTags.includes(elem.tagName);
    }

    /** Attach DropDown component to specified input element */
    attachToInput() {
        if (!this.isInputElement(this.hostElem)) {
            throw new Error('Invalid element specified');
        }

        // Create container
        this.elem = ce('div', { className: CONTAINER_CLASS });
        this.selectionElem = ce('div', { className: SELECTION_CLASS });

        if (this.hostElem.disabled) {
            this.state.disabled = true;
        }

        if (this.hostElem.tagName === 'SELECT') {
            this.selectElem = this.hostElem;
            if (this.selectElem.multiple) {
                this.props.multi = true;
            }

            insertAfter(this.elem, this.selectElem);
            this.inputElem = ce('input', { type: 'text' });
        } else {
            insertAfter(this.elem, this.hostElem);
            this.inputElem = re(this.hostElem);

            this.selectElem = ce('select');
        }

        if (this.props.multi) {
            this.selectElem.multiple = true;
            this.elem.classList.add(MULTIPLE_CLASS);
        }

        if (this.props.enableFilter) {
            this.state.editable = true;
        }
    }

    /** Attach DropDown to specified element */
    attachToElement() {
        this.elem = ce('div', { className: ATTACHED_CLASS });

        insertAfter(this.elem, this.hostElem);
        this.elem.style.width = px(this.hostElem.offsetWidth);
        this.elem.style.height = px(this.hostElem.offsetHeight);

        this.elem.append(this.hostElem);

        this.hostElem.addEventListener('click', this.toggleHandler);
        if (this.isInputElement(this.hostElem)) {
            this.state.editable = this.props.enableFilter;
        } else {
            this.state.editable = false;
        }

        if (!this.state.disabled && this.staticElem) {
            this.staticElem.addEventListener('click', this.toggleHandler);
        }

        this.selectElem = ce('select');
        if (this.props.multi) {
            this.selectElem.multiple = true;
        }

        this.elem.append(this.hostElem, this.selectElem);

        return true;
    }

    /** Create combo element and return if success */
    createCombo() {
        if (this.props.listAttach || !this.inputElem) {
            return null;
        }

        // Create single selection element
        this.staticElem = ce('span', { className: SINGLE_SELECTION_CLASS });
        show(this.staticElem, !this.state.editable);

        this.toggleBtn = this.createToggleButton();

        const res = ce('div', { className: COMBO_CLASS });
        if (this.props.multi) {
            res.append(this.selectionElem);
        }
        res.append(this.staticElem, this.inputElem);
        if (this.props.multi) {
            this.clearBtn = this.createClearButton();
            res.append(this.clearBtn);
        }
        res.append(this.selectElem, this.toggleBtn);

        return res;
    }

    /** Create clear selection button */
    createClearButton() {
        const closeIcon = svg(
            'svg',
            { class: CLEAR_ICON_CLASS },
            svg('path', { d: CLOSE_ICON }),
        );
        const res = ce(
            'div',
            { className: CLEAR_BTN_CLASS },
            closeIcon,
            { click: () => this.onClear() },
        );

        if (this.state.disabled) {
            res.disabled = true;
        }

        return res;
    }

    /** Create toggle drop down button */
    createToggleButton() {
        const arrowIcon = svg(
            'svg',
            { class: TOGGLE_ICON_CLASS, width: 24, height: 32 },
            svg('path', { d: TOGGLE_ICON }),
        );
        const res = ce(
            'div',
            { className: TOGGLE_BTN_CLASS },
            arrowIcon,
            { click: this.toggleHandler },
        );

        if (this.state.disabled) {
            res.disabled = true;
        }

        return res;
    }

    /* Event handlers */
    /** Add focus/blur event handlers to specified element */
    assignInputHandlers(elem) {
        setEvents(elem, this.inpHandlers);
    }

    /** Remove focus/blur event handlers from specified element */
    removeInputHandlers(elem) {
        removeEvents(elem, this.inpHandlers);
    }

    /** List item 'click' event handler */
    onListItemClick(e) {
        e.stopPropagation();

        const item = this.getItemByElem(e.target);
        if (!item || item.disabled) {
            return;
        }

        this.toggleItem(item.id);

        this.sendItemSelectEvent();
        this.state.changed = true;

        if (!this.props.multi) {
            this.showList(false);
        }
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

        if (this.isSelectedItemElement(e.target)) {
            e.target.classList.add(SELECTION_ITEM_ACTIVE_CLASS);
        } else if (e.target === this.inputElem) {
            this.activateSelectedItem(-1);
        } else if (e.target === this.elem) {
            if (e.relatedTarget === this.inputElem) {
                return;
            }

            if (this.state.editable && this.inputElem) {
                this.inputElem.focus();
            }
        }

        this.state.focusedElem = e.target;
    }

    /** 'blur' event handler */
    onBlur(e) {
        if (!this.isChildTarget(e.relatedTarget)) {
            this.showList(false);
            this.activate(false);
        }

        if (e.target === this.selectElem) {
            this.sendChangeEvent();
        } else if (this.isSelectedItemElement(e.target)) {
            e.target.classList.remove(SELECTION_ITEM_ACTIVE_CLASS);
        }

        this.state.focusedElem = null;
    }

    /** Click by delete button of selected item event handler */
    onDeleteSelectedItem(e) {
        if (!e || !e.target || !this.props.multi) {
            return false;
        }

        if (e.type === 'keydown' && (
            !this.isSelectedItemElement(e.target)
            || !e.target.classList.contains(SELECTION_ITEM_ACTIVE_CLASS)
        )) {
            return true;
        }

        if (e.type === 'click'
            && !e.target.classList.contains(SELECTION_ITEM_DEL_BTN_CLASS)) {
            return true;
        }

        const selectedItems = this.getSelectedItems(this.state);
        if (!selectedItems.length) {
            return true;
        }

        const index = this.getSelectedItemIndex(e.target);
        if (index === -1) {
            return true;
        }

        // Focus host input if deselect last(right) selected item
        // Activate next selected item otherwise
        if (e.type === 'click' || index === selectedItems.length - 1) {
            this.activateSelectedItem(-1);
            setTimeout(() => this.inputElem.focus());
        } else {
            this.activateSelectedItem(index);
        }

        const item = selectedItems[index];
        if (item) {
            this.deselectItem(item.id);
        }

        this.sendItemSelectEvent();
        this.state.changed = true;
        this.sendChangeEvent();

        return true;
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

        if (
            (this.state.editable && e.target === this.inputElem)
            || (!this.state.editable && e.target === this.elem)
        ) {
            if (
                this.props.multi
                && (
                    e.code === 'Backspace'
                    || e.key === 'Backspace'
                    || e.code === 'ArrowLeft'
                    || e.key === 'Left'
                )
            ) {
                if (this.state.editable && e.currentTarget === this.inputElem) {
                    const cursorPos = getCursorPos(this.inputElem);
                    if (cursorPos && cursorPos.start === cursorPos.end && cursorPos.start === 0) {
                        this.activateLastSelectedItem();
                    }
                } else {
                    this.activateLastSelectedItem();
                }

                return;
            }
        }

        if (e.code === 'Backspace' || e.key === 'Backspace') {
            if (this.props.multi && this.isSelectedItemElement(e.target)) {
                const selectedItems = this.getSelectedItems(this.state);
                if (!selectedItems.length) {
                    return;
                }

                const index = this.getSelectedItemIndex(e.target);
                if (index === -1) {
                    return;
                }

                if (index === 0) {
                    // Activate first selected item if available or focus host input otherwise
                    if (selectedItems.length > 1) {
                        this.activateSelectedItem(1);
                    } else {
                        this.activateSelectedItem(-1);
                        setTimeout(() => this.inputElem.focus());
                    }
                } else {
                    // Activate previous selected item
                    this.activateSelectedItem(index - 1);
                }

                const item = selectedItems[index];
                if (item) {
                    this.deselectItem(item.id);

                    this.sendItemSelectEvent();
                    this.state.changed = true;
                    this.sendChangeEvent();
                }
            }

            return;
        }

        if (this.props.multi && (e.code === 'Delete' || e.key === 'Del')) {
            this.onDeleteSelectedItem(e);
            return;
        }

        if (this.props.multi && (e.code === 'ArrowLeft' || e.key === 'Left')) {
            if (this.isSelectedItemElement(e.target)) {
                const selectedItems = this.getSelectedItems(this.state);
                if (!selectedItems.length) {
                    return;
                }

                const index = this.getSelectedItemIndex(e.target);
                if (index === 0) {
                    return;
                }

                this.activateSelectedItem(index - 1);
            }

            return;
        }

        if (this.props.multi && (e.code === 'ArrowRight' || e.key === 'Right')) {
            if (this.isSelectedItemElement(e.target)) {
                const selectedItems = this.getSelectedItems(this.state);
                if (!selectedItems.length) {
                    return;
                }

                const index = this.getSelectedItemIndex(e.target);
                if (index === -1) {
                    return;
                }

                if (index === selectedItems.length - 1) {
                    this.activateSelectedItem(-1);
                    setTimeout(this.inputElem.focus.bind(this.inputElem));
                } else {
                    this.activateSelectedItem(index + 1);
                }
            }

            return;
        }

        const activeItem = this.getActiveItem();

        if (e.code === 'ArrowDown' || e.key === 'Down') {
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
        } else if (e.code === 'ArrowUp' || e.key === 'Up') {
            if (this.state.visible && activeItem) {
                newItem = this.getPrevAvailableItem(activeItem.id);
            }
        } else if (e.code === 'Home' || e.key === 'Home') {
            const availItems = this.getAvailableItems(this.state);
            if (availItems.length > 0) {
                [newItem] = availItems;
            }
        } else if (e.code === 'End' || e.key === 'End') {
            const availItems = this.getAvailableItems(this.state);
            if (availItems.length > 0) {
                newItem = availItems[availItems.length - 1];
            }
        } else if (e.code === 'Enter' || e.key === 'Enter') {
            if (activeItem) {
                this.toggleItem(activeItem.id);
                this.sendItemSelectEvent();
                this.state.changed = true;

                if (!this.props.multi) {
                    this.showList(false);
                }
            }

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

    /**
     * Handler for 'touchstart' event on list item
     * Set blockTouch flasg for further 'mousemove' event
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
        if (this.props.enableFilter && this.inputElem) {
            this.filter(this.inputElem.value);
        }

        if (isFunction(this.props.oninput)) {
            this.props.oninput(e);
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

    /* List items methods */
    /** Return list item object by id */
    getItem(itemId) {
        const strId = itemId.toString();
        return this.state.items.find((item) => item.id === strId);
    }

    /** Return active list item */
    getActiveItem() {
        return this.state.items.find((item) => item.active);
    }

    /** Return index of list item by id */
    getItemIndex(itemId) {
        const strId = itemId.toString();
        return this.state.items.findIndex((item) => item.id === strId);
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
        return state.items.filter((item) => !item.hidden);
    }

    /** Return array of visible and enabled list items */
    getAvailableItems(state = this.state) {
        return state.items.filter((item) => (!item.hidden && !item.disabled));
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
            if (item && !item.hidden && !item.disabled) {
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
            if (item && !item.hidden && !item.disabled) {
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
        if (!elem) {
            return null;
        }
        const li = elem.closest('li');
        if (!li) {
            return null;
        }
        return this.getItem(li.dataset.id);
    }

    /** Returns list element for specified item id */
    getListItemElem(id) {
        return this.listElem.querySelector(`[data-id="${id}"]`);
    }

    /** Calculate height, vertical and horizontal offset of list element */
    calculatePosition(state) {
        if (isVisible(this.selectElem, true)) {
            return;
        }

        if (!this.list || !state.visible) {
            return;
        }

        const html = document.documentElement;
        const { scrollHeight } = html;
        const screenBottom = html.scrollTop + html.clientHeight;

        this.elem.classList.add(LIST_OPEN_CLASS);

        let listHeight = 0;
        const visibleItems = this.getVisibleItems(state);
        if (visibleItems.length > 0) {
            const [visibleItem] = visibleItems;
            const visibleElem = this.getListItemElem(visibleItem.id);
            const itemHeight = parseInt(visibleElem.offsetHeight, 10);
            const itemsToShow = Math.min(state.maxHeight, visibleItems.length);
            listHeight = itemsToShow * itemHeight;
        }

        let border = 0;
        if (!this.props.listAttach) {
            border = (this.comboElem.offsetHeight - this.comboElem.scrollHeight) / 2;
        }

        this.list.style.height = px(0);

        const offset = getOffset(this.list.offsetParent);
        const container = getOffset(this.elem);
        container.width = this.elem.offsetWidth;
        container.height = this.elem.offsetHeight;
        const combo = (!this.props.listAttach)
            ? {
                ...getOffset(this.comboElem),
                width: this.comboElem.offsetWidth,
                height: this.comboElem.offsetHeight,
            }
            : null;

        const totalListHeight = container.height + listHeight;
        const listBottom = container.top + totalListHeight;

        if (this.props.fullScreen && isVisible(this.backgroundElem)) {
            document.body.style.overflow = 'hidden';
            this.list.classList.add(LIST_DROP_DOWN_CLASS);

            this.list.style.left = px(combo.left);
            this.list.style.top = px(combo.top - offset.top + combo.height - border);

            const fullScreenListHeight = html.clientHeight - combo.height;
            this.list.style.height = px(fullScreenListHeight / 2);
        } else {
            // Check vertical offset of drop down list
            if (listBottom > scrollHeight) {
                this.list.classList.add(LIST_DROP_UP_CLASS);
                this.list.style.top = px(container.top - offset.top - listHeight + border);
            } else {
                this.list.classList.add(LIST_DROP_DOWN_CLASS);
                if (listBottom > screenBottom) {
                    html.scrollTop += listBottom - screenBottom;
                }
                this.list.style.top = px(
                    container.top - offset.top + container.height - border,
                );
            }

            this.list.style.height = px(
                listHeight + this.list.offsetHeight - this.list.scrollHeight,
            );
        }

        // Check horizontal offset of drop down list
        const minWidth = (combo) ? combo.width : container.width;
        this.list.style.minWidth = px(minWidth);
        this.list.style.width = '';

        if (this.props.fullScreen) {
            return;
        }

        // Check list element wider than screen
        const listWidth = this.list.offsetWidth;
        if (listWidth >= html.clientWidth) {
            this.list.style.width = px(html.clientWidth);
            this.list.style.left = px(0);
        } else {
            const leftOffset = container.left - html.scrollLeft;

            // Check list overflows screen to the right
            // if rendered from the left of container
            if (leftOffset + listWidth > html.clientWidth) {
                const listLeft = container.left + container.width - listWidth - offset.left;
                if (listLeft < 0) {
                    this.list.style.left = px(0);
                    this.list.style.width = px(listWidth + listLeft);
                } else {
                    this.list.style.left = px(listLeft);
                }
            } else {
                this.list.style.left = px(container.left - offset.left);
            }
        }
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
        if (this.props.listAttach) {
            return;
        }

        this.state.editable = editable;

        if (this.props.placeholder) {
            this.inputElem.placeholder = this.props.placeholder;
        }

        show(this.staticElem, !this.state.editable);
        show(this.inputElem, this.state.editable);

        if (this.state.editable) {
            this.elem.classList.add('dd__editable');
            this.inputElem.addEventListener('input', this.inputHandler);
            this.inputElem.classList.add('dd__input');
            this.inputElem.value = this.staticElem.textContent;
            this.assignInputHandlers(this.inputElem);
            this.inputElem.autocomplete = 'off';
        } else {
            this.elem.classList.remove('dd__editable');
            this.removeInputHandlers(this.inputElem);
            this.inputElem.removeEventListener('input', this.inputHandler);
            this.inputElem.classList.remove('dd__input');

            const content = (this.props.placeholder && this.inputElem.value.length === 0)
                ? this.props.placeholder
                : this.inputElem.value;
            this.staticElem.textContent = content;

            this.staticElem.addEventListener('click', this.toggleHandler);
        }
    }

    /** Setup tabindexes of component */
    setTabIndexes() {
        if (this.state.disabled) {
            this.elem.removeAttribute('tabindex');
            if (this.inputElem) {
                this.inputElem.removeAttribute('tabindex');
            }
            this.selectElem.removeAttribute('tabindex');
        } else if (isVisible(this.selectElem, true)) {
            this.selectElem.setAttribute('tabindex', 0);
            this.elem.setAttribute('tabindex', -1);
            if (this.inputElem) {
                this.inputElem.setAttribute('tabindex', (this.state.editable) ? 0 : -1);
            }
        } else {
            this.selectElem.setAttribute('tabindex', -1);
            this.elem.setAttribute('tabindex', (this.state.editable) ? -1 : 0);
            if (this.inputElem) {
                this.inputElem.setAttribute('tabindex', (this.state.editable) ? 0 : -1);
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
        });
    }

    /** Show drop down list if hidden or hide if visible */
    toggleList() {
        if (!this.list || !this.listElem || this.state.disabled) {
            return;
        }
        // Flush filter
        if (!this.state.visible && this.state.filtered && !this.state.manFilter) {
            this.showAllItems();
        }

        this.showList(!this.state.visible);
    }

    /** Activate or deactivate component */
    activate(val) {
        if (this.state.active === val) {
            return;
        }

        this.setState({
            ...this.state,
            active: val,
        });
    }

    /** Check specified element is child of some selected item element */
    isSelectedItemElement(elem) {
        return elem && this.selectionElem?.contains(elem);
    }

    /** Check specified element is child of component */
    isChildTarget(elem) {
        return elem && this.elem.contains(elem);
    }

    /** Renturns default list item container */
    defaultItem(item) {
        const elem = ce('div', { className: LIST_ITEM_CLASS });

        if (this.props.multi) {
            const checkIcon = svg(
                'svg',
                {
                    class: CHECK_ICON_CLASS,
                    width: 17,
                    height: 17,
                    viewBox: '0 1 10 10',
                },
                svg('path', { d: CHECK_ICON }),
            );
            const titleElem = ce('span', { title: item.title, textContent: item.title });
            elem.append(checkIcon, titleElem);
        } else {
            elem.title = item.title;
            elem.textContent = item.title;
        }

        return elem;
    }

    /** Render list item element */
    renderItem(item) {
        const renderCallback = isFunction(this.renderItemCallback)
            ? this.renderItemCallback
            : this.defaultItem;

        const contentElem = renderCallback.call(this, item);
        setEvents(contentElem, {
            touchstart: this.touchStartHandler,
            mousemove: this.moveHandler,
        });
        if (this.props.multi && item.selected) {
            contentElem.classList.add(SELECTED_LIST_ITEM_CLASS);
        }
        if (item.active) {
            contentElem.classList.add(LIST_ITEM_ACTIVE_CLASS);
        }

        const elem = ce('li', {}, contentElem, { click: (e) => this.onListItemClick(e) });
        elem.setAttribute('data-id', item.id);
        if (item.disabled) {
            elem.setAttribute('disabled', '');
        }
        show(elem, !item.hidden);

        return elem;
    }

    /** Return selected item element for specified item object */
    defaultSelectionItem(item) {
        const deselectButton = ce(
            'span',
            { className: SELECTION_ITEM_DEL_BTN_CLASS, innerHTML: '&times;' },
            null,
            { click: (e) => this.onDeleteSelectedItem(e) },
        );

        return ce(
            'span',
            { className: SELECTION_ITEM_CLASS, textContent: item.title },
            deselectButton,
        );
    }

    /** Render selection elements */
    renderSelection(state, prevState) {
        if (this.props.listAttach) {
            return;
        }

        this.renderSingleSelection(state);

        const prevSelectedItems = this.getSelectedItems(prevState);
        const selectedItems = this.getSelectedItems(state);
        const selectionChanged = !deepMeet(prevSelectedItems, selectedItems);

        if (selectionChanged) {
            const renderCallback = isFunction(this.renderSelectionItemCallback)
                ? this.renderSelectionItemCallback
                : this.defaultSelectionItem;
            const selectedElems = selectedItems.map((item) => {
                const elem = renderCallback.call(this, item);
                if (!elem) {
                    return null;
                }

                elem.tabIndex = -1;
                elem.dataset.id = item.id;
                this.assignInputHandlers(elem);

                return elem;
            });

            // Remove input handlers to avoid 'blur' event on remove elements from DOM tree
            const prevSelElems = Array.from(this.selectionElem.querySelectorAll(`.${SELECTION_ITEM_CLASS}`));
            prevSelElems.forEach((selelem) => this.removeInputHandlers(selelem));

            removeChilds(this.selectionElem);
            this.selectionElem.append(...selectedElems);
            this.selectedElems = selectedElems;
        }

        if (this.state.actSelItemIndex !== -1 && !this.state.disabled) {
            setTimeout(() => this.selectedElems[this.state.actSelItemIndex].focus());
        }
    }

    /** Return selected items data for 'itemselect' and 'change' events */
    getSelectionData() {
        const selectedItems = this.getSelectedItems(this.state)
            .map((item) => ({ id: item.id, value: item.title }));

        if (this.props.multi) {
            return selectedItems;
        }

        return (selectedItems.length > 0) ? selectedItems[0] : null;
    }

    /** Send current selection data to 'itemselect' event handler */
    sendItemSelectEvent() {
        if (isFunction(this.props.onitemselect)) {
            const data = this.getSelectionData();
            this.props.onitemselect.call(this, data);
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

        if (isFunction(this.props.onchange)) {
            const data = this.getSelectionData();
            this.props.onchange.call(this, data);
        }

        this.state.changed = false;
    }

    /** Toggle item selected status */
    toggleItem(itemId) {
        const item = this.getItem(itemId);
        if (!item) {
            throw new Error(`Item ${itemId} not found`);
        }

        if (item.selected && this.props.multi) {
            return this.deselectItem(itemId);
        }

        return this.selectItem(itemId);
    }

    /** Select specified item */
    selectItem(itemId) {
        const strId = itemId.toString();
        const itemToSelect = this.getItem(strId);
        if (!itemToSelect) {
            throw new Error(`Item ${itemId} not found`);
        }
        if (itemToSelect.selected) {
            return;
        }

        this.setState({
            ...this.state,
            inputString: null,
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

        const strId = itemId.toString();
        const itemToDeselect = this.getItem(strId);
        if (!itemToDeselect) {
            throw new Error(`Item ${itemId} not found`);
        }

        if (!itemToDeselect.selected) {
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

    /** Return index of selected item contains specified element */
    getSelectedItemIndex(elem) {
        const selItemElem = elem.closest(`.${SELECTION_ITEM_CLASS}`);
        if (!selItemElem) {
            return -1;
        }

        const selectedItems = this.getSelectedItems(this.state);
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

        if (index === -1) {
            this.state.actSelItemIndex = -1;
            return;
        }

        // Check correctness of index
        const selectedItems = this.getSelectedItems(this.state);
        if (index < 0 || index >= selectedItems.length) {
            return;
        }

        this.state.actSelItemIndex = index;
        this.setActive(null);
    }

    /** Activate last(right) selected item */
    activateLastSelectedItem() {
        const selectedItems = this.getSelectedItems(this.state);
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
                hidden: false,
            })),
        });
    }

    /** Show only items containing specified string */
    filter(fstr) {
        let found = false;
        const lfstr = fstr.toLowerCase();

        this.state.inputString = fstr;

        if (lfstr.length === 0) {
            this.showAllItems();
        } else {
            const filteredItems = this.state.items.filter(
                (item) => item.title.toLowerCase().includes(lfstr),
            );
            const filteredIds = filteredItems.map((item) => item.id);
            found = filteredItems.length > 0;

            const items = (found)
                ? this.state.items.map((item) => ({
                    ...item,
                    hidden: !filteredIds.includes(item.id),
                }))
                : this.state.items;

            this.setState({
                ...this.state,
                filtered: found,
                filteredCount: filteredItems.length,
                visible: found,
                items,
            });
        }

        return found;
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

        const optgroup = ce('optgroup', { hidden: true, disabled: true });
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

        const data = Array.isArray(items) ? items : [items];
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
        const option = ce('option', {
            value: item.id,
            textContent: item.title,
            selected: item.selected,
        });
        if (item.disabled) {
            option.setAttribute('disabled', '');
        }

        if (item.hidden) {
            return ce('div', { className: OPTION_WRAPPER_CLASS }, option);
        }

        return option;
    }

    /** Returns option group element */
    createOptGroup(label, disabled = false) {
        const optGroup = ce('optgroup', { label });
        if (disabled) {
            optGroup.setAttribute('disabled', '');
        }

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
        const item = this.createItem(props);
        if (!item) {
            return;
        }

        const newItems = this.processSingleSelection([
            ...this.state.items,
            item,
        ]);

        this.setState({
            ...this.state,
            items: newItems,
        });
    }

    /** Returns new item object */
    createItem(props = {}) {
        if (!props || !('id' in props)) {
            throw new Error('Item id not specified');
        }

        const item = {
            id: props.id.toString(),
            title: props.title,
            selected: props.selected,
            hidden: props.hidden,
            disabled: props.disabled,
            active: false,
            group: props.group,
        };

        return item;
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
        const listElem = ce('ul');
        const res = {
            listElem,
            elem: ce(
                'div',
                { className: LIST_GROUP_CLASS },
                [
                    ce('label', { textContent: group.title }),
                    listElem,
                ],
            ),
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
            items: this.state.items.map((item) => ({
                ...item,
                active: item === itemToActivate,
            })),
        });

        if (this.state.blockScroll) {
            return;
        }

        if (!itemToActivate || !this.state.items.length) {
            return;
        }

        if (this.state.editable) {
            setTimeout(() => this.inputElem.focus());
        }
    }

    /** Enable/disable list item by id */
    enableItem(itemId, val) {
        const strId = itemId.toString();
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
        if (this.props.multi || this.props.listAttach) {
            return;
        }

        const selectedItems = this.getSelectedItems(state);
        const str = (selectedItems.length > 0)
            ? selectedItems[0].title
            : '';

        if (str.length > 0) {
            if (state.editable && this.inputElem && state.inputString == null) {
                this.inputElem.value = str;
            } else if (!state.editable && this.staticElem) {
                this.staticElem.textContent = str;
                this.staticElem.title = str;
                this.staticElem.classList.remove(PLACEHOLDER_CLASS);
            }
        } else {
            this.staticElem.textContent = this.props.placeholder;
            this.staticElem.title = '';
            this.staticElem.classList.add(PLACEHOLDER_CLASS);
        }
    }

    setState(state) {
        if (this.state === state) {
            return;
        }

        this.render(state, this.state);
        this.state = state;
    }

    getGroupItems(state, group) {
        return state.items.filter((item) => item && item.group === group);
    }

    renderSelect(state) {
        const optGroups = [];
        const options = [];

        // Add disabled option for iOS
        if (!this.props.multi) {
            const zeroItem = this.getItem(0);
            if (!zeroItem) {
                options.push(this.createOption({ id: 0, title: '', disabled: true }));
            }
        }

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

    renderListContent(state) {
        const optGroups = [];
        const listElems = [];

        state.items.forEach((item) => {
            const itemElem = this.renderItem(item);

            if (item.group) {
                let group = optGroups.find((groupItem) => groupItem.group === item.group);
                if (!group) {
                    group = {
                        group: item.group,
                        elems: this.renderGroupItem(item.group),
                    };
                    optGroups.push(group);
                    listElems.push(group.elems.elem);
                }
                group.elems.listElem.append(itemElem);
            } else {
                listElems.push(itemElem);
            }
        });

        removeChilds(this.listElem);
        this.listElem.append(...listElems);
    }

    renderList(state) {
        // Skip render if currently native select is visible
        if (isVisible(this.selectElem, true)) {
            return;
        }

        this.renderListContent(state);

        if (state.visible) {
            this.calculatePosition(state);

            if (state.editable) {
                setTimeout(() => this.inputElem.focus());
            }
            this.list.scrollTop = 0;
        } else {
            this.elem.classList.remove(LIST_OPEN_CLASS);
            if (this.props.fullScreen) {
                document.body.style.overflow = '';
            }

            this.list.classList.remove(LIST_DROP_DOWN_CLASS);
            this.list.classList.remove(LIST_DROP_UP_CLASS);
        }
    }

    render(state, prevState = {}) {
        if (state.active) {
            this.elem.classList.add(ACTIVE_CLASS);
        } else {
            this.elem.classList.remove(ACTIVE_CLASS);
        }

        if (state.disabled) {
            this.elem.classList.add(DISABLED_CLASS);
            this.elem.classList.remove(ENABLED_CLASS);
            this.removeInputHandlers(this.elem);
        } else {
            this.elem.classList.remove(DISABLED_CLASS);
            this.elem.classList.add(ENABLED_CLASS);
            this.assignInputHandlers(this.elem);
        }

        this.setTabIndexes();

        this.selectElem.disabled = state.disabled;
        if (this.inputElem) {
            this.inputElem.disabled = state.disabled;
        }
        if (this.toggleBtn) {
            this.toggleBtn.disabled = state.disabled;
        }

        this.renderSelection(state, prevState);
        this.renderSelect(state);
        this.renderList(state);
    }
}
