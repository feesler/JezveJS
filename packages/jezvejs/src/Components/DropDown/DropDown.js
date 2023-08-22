import {
    isFunction,
    createElement,
    removeChilds,
    re,
    px,
    insertAfter,
    prependChild,
    isVisible,
    getCursorPos,
    setEvents,
    removeEvents,
    enable,
    asArray,
    debounce,
} from '../../js/common.js';
import { setEmptyClick, removeEmptyClick } from '../../js/emptyClick.js';
import { Component } from '../../js/Component.js';

import { CheckboxItem } from '../Menu/Menu.js';
import { PopupPosition } from '../PopupPosition/PopupPosition.js';
import { ScrollLock } from '../ScrollLock/ScrollLock.js';

import {
    getGroupItems,
    getSelectedItems,
    getVisibleGroupItems,
    getVisibleItems,
} from './utils.js';

import { DropDownInput } from './components/Input/Input.js';
import { DropDownSingleSelection } from './components/SingleSelection/SingleSelection.js';
import { DropDownPlaceholder } from './components/Placeholder/Placeholder.js';
import { DropDownComboBox } from './components/ComboBox/ComboBox.js';
import { DropDownMenu } from './components/Menu/Menu.js';
import { DropDownMenuHeader } from './components/MenuHeader/MenuHeader.js';
import { DropDownMenuList } from './components/MenuList/MenuList.js';
import { DropDownListItem } from './components/ListItem/ListItem.js';
import { DropDownGroupItem } from './components/GroupItem/GroupItem.js';
import { DropDownGroupHeader } from './components/GroupHeader/GroupHeader.js';
import { DropDownListPlaceholder } from './components/ListPlaceholder/ListPlaceholder.js';
import { DropDownMultipleSelection } from './components/MultipleSelection/MultipleSelection.js';
import { DropDownMultiSelectionItem } from './components/MultiSelectionItem/MultiSelectionItem.js';
import { DropDownClearButton } from './components/ClearButton/ClearButton.js';
import { DropDownToggleButton } from './components/ToggleButton/ToggleButton.js';

import '../../css/common.scss';
import './DropDown.scss';

export {
    getGroupItems,
    getSelectedItems,
    getVisibleGroupItems,
    getVisibleItems,
};

/* CSS classes */
/* Container */
const CONTAINER_CLASS = 'dd__container';
const STATIC_CLASS = 'dd__container_static';
const MULTIPLE_CLASS = 'dd__container_multiple';
const ACTIVE_CLASS = 'dd__container_active';
const MENU_ACTIVE_CLASS = 'dd__list_active';
const ATTACHED_CLASS = 'dd__container_attached';
const NATIVE_CLASS = 'dd__container_native';
const FULLSCREEN_CLASS = 'dd__fullscreen';
const EDITABLE_CLASS = 'dd__editable';

/* List */
const FIXED_LIST_CLASS = 'dd__list_fixed';
const LIST_OPEN_CLASS = 'dd__open';
const MENU_OPEN_CLASS = 'dd__list_open';
/* other */
const OPTION_WRAPPER_CLASS = 'dd__opt-wrapper';
const CREATE_ITEM_CLASS = 'dd__create-item';

/* List position constants */
const SCREEN_PADDING = 5;
const LIST_MARGIN = 5;
const ATTACH_REF_HEIGHT = 5;

const IGNORE_SCROLL_TIMEOUT = 500;
const SHOW_LIST_SCROLL_TIMEOUT = 100;

/** Default properties */
const defaultProps = {
    name: undefined,
    form: undefined,
    multiple: false,
    listAttach: false,
    static: false,
    isValidToggleTarget: null,
    fixedMenu: false,
    enableFilter: false,
    openOnFocus: false,
    noResultsMessage: 'No items',
    allowCreate: false,
    addItemMessage: (title) => `Add item: '${title}'`,
    disabled: false,
    useNativeSelect: false,
    fullScreen: false,
    placeholder: null,
    blurInputOnSingleSelect: true,
    useSingleSelectionAsPlaceholder: true,
    clearFilterOnMultiSelect: false,
    showMultipleSelection: true,
    showClearButton: true,
    showToggleButton: true,
    onItemSelect: null,
    onChange: null,
    onInput: null,
    className: null,
    components: {
        Input: DropDownInput,
        Placeholder: DropDownPlaceholder,
        SingleSelection: DropDownSingleSelection,
        ComboBox: DropDownComboBox,
        Menu: DropDownMenu,
        MenuList: DropDownMenuList,
        ListItem: DropDownListItem,
        Checkbox: CheckboxItem,
        GroupItem: DropDownGroupItem,
        GroupHeader: DropDownGroupHeader,
        ListPlaceholder: DropDownListPlaceholder,
        MultipleSelection: DropDownMultipleSelection,
        MultiSelectionItem: DropDownMultiSelectionItem,
        ToggleButton: DropDownToggleButton,
        ClearButton: DropDownClearButton,
    },
};

/**
 * Drop Down comoponent
 * @param {Object} props
 * @param {string|Element} props.elem - identifier or element to attach DropDown component to
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

    static menuIds = [];

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });

        this.hostElem = this.elem;
        this.elem = null;
        if (!this.hostElem) {
            this.props.listAttach = false;
        }

        this.focusedElem = null;

        const disabled = (
            this.props.disabled
            || (!this.props.listAttach && !!this.hostElem?.disabled)
        );

        this.state = {
            active: false,
            changed: false,
            visible: false,
            inputString: null,
            filtered: false,
            openOnFocus: this.props.openOnFocus,
            allowCreate: this.props.allowCreate,
            disabled,
            items: [],
            groups: [],
            actSelItemIndex: -1,
            menuId: this.generateMenuId(),
            isTouch: false,
            ignoreScroll: false,
            listeningWindow: false,
            waitForScroll: false,
            renderTime: Date.now(),
        };

        this.emptyClickHandler = () => this.showList(false);
        const clickHandler = (e) => this.onClick(e);

        this.commonEvents = {
            click: clickHandler,
            touchstart: clickHandler,
            focus: (e) => this.onFocus(e),
            blur: (e) => this.onBlur(e),
            keydown: (e) => this.onKey(e),
        };
        this.viewportEvents = { resize: (e) => this.onViewportResize(e) };
        this.windowEvents = {
            scroll: {
                listener: (e) => this.onWindowScroll(e),
                options: { passive: true, capture: true },
            },
        };

        this.showListHandler = debounce(
            () => this.stopScrollWaiting(),
            SHOW_LIST_SCROLL_TIMEOUT,
        );

        this.inputElem = null;

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
        }

        this.elem.dataset.target = this.state.menuId;

        this.createList();
        setEvents(this.selectElem, { change: (e) => this.onChange(e) });

        if (!this.props.listAttach) {
            const {
                ComboBox,
                Input,
                SingleSelection,
                Placeholder,
                MultipleSelection,
                MultiSelectionItem,
                ToggleButton,
                ClearButton,
            } = this.props.components;

            this.combo = ComboBox.create({
                inputElem: this.inputElem,
                multiple: this.props.multiple,
                placeholder: this.props.placeholder,
                useSingleSelectionAsPlaceholder: this.props.useSingleSelectionAsPlaceholder,
                showMultipleSelection: this.props.showMultipleSelection,
                showClearButton: this.props.showClearButton,
                showToggleButton: this.props.showToggleButton,
                editable: this.isEditable(),
                enableFilter: this.props.enableFilter,
                disabled: this.state.disabled,
                items: this.state.items,
                actSelItemIndex: this.state.actSelItemIndex,
                inputString: this.state.inputString,
                onInput: (e) => this.onInput(e),
                onDeleteSelectedItem: (e) => this.onDeleteSelectedItem(e),
                onClearSelection: (e) => this.onClear(e),
                components: {
                    Input,
                    SingleSelection,
                    Placeholder,
                    MultipleSelection,
                    MultiSelectionItem,
                    ToggleButton,
                    ClearButton,
                },
            });
            this.elem.appendChild(this.combo.elem);
        }

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

    /** Returns true if filter input is available and enabled */
    isEditable(state = this.state) {
        return (
            this.props.enableFilter
            && !state.disabled
            && (!this.props.fullScreen || state.visible)
        );
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

        if (this.hostElem.tagName === 'SELECT') {
            this.selectElem = this.hostElem;
            if (this.selectElem.multiple) {
                this.props.multiple = true;
            }

            if (this.selectElem.parentNode) {
                insertAfter(this.elem, this.selectElem);
            }
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

        if (this.props.multiple) {
            this.selectElem.multiple = true;
            this.elem.classList.add(MULTIPLE_CLASS);
        }

        this.elem.classList.toggle(STATIC_CLASS, this.props.static);
    }

    /** Attach DropDown to specified element */
    attachToElement() {
        this.elem = createElement('div', { props: { className: ATTACHED_CLASS } });
        insertAfter(this.elem, this.hostElem);
        this.elem.append(this.hostElem);

        this.createSelect();
        if (this.props.multiple) {
            this.selectElem.multiple = true;
        }

        this.elem.append(this.hostElem, this.selectElem);

        return true;
    }

    /** Creates select element */
    createSelect() {
        this.selectElem = createElement('select');
    }

    /** Creates list element */
    createList() {
        const {
            Input,
            Menu,
            MenuList,
            ListItem,
            Checkbox,
            GroupItem,
            GroupHeader,
            ListPlaceholder,
        } = this.props.components;

        const { multiple } = this.props;
        const showInput = this.props.listAttach && this.props.enableFilter;

        this.menu = Menu.create({
            parentId: this.state.menuId,
            className: (this.props.fixedMenu) ? FIXED_LIST_CLASS : null,
            multiple,
            defaultItemType: (multiple) ? 'checkbox' : 'button',
            tabThrough: false,
            getItemById: (id) => this.getItem(id),
            getPlaceholderProps: (state) => this.renderNotFound(state),
            onItemClick: (id) => this.onListItemClick(id),
            onItemActivate: (id) => this.setActive(id),
            onPlaceholderClick: () => this.handlePlaceholderSelect(),
            renderTime: this.state.renderTime,
            header: {
                inputElem: this.inputElem,
                inputPlaceholder: this.props.placeholder,
                useSingleSelectionAsPlaceholder: this.props.useSingleSelectionAsPlaceholder,
                multiple,
                onInput: (e) => this.onInput(e),
                components: {
                    Input,
                },
            },
            components: {
                Input,
                MenuList,
                ListItem,
                Checkbox,
                GroupItem,
                GroupHeader,
                ListPlaceholder,
                Header: (showInput) ? DropDownMenuHeader : null,
            },
        });

        if (this.props.fixedMenu) {
            document.body.append(this.menu.elem);
        } else {
            this.elem.append(this.menu.elem);
        }
    }

    startScrollIgnore(state = this.state) {
        if (!state.ignoreScroll) {
            this.setState({ ...state, ignoreScroll: true });
        }
    }

    stopScrollIgnore(state = this.state) {
        if (state.ignoreScroll) {
            this.setState({ ...state, ignoreScroll: false });
        }
    }

    startScrollWaiting(state = this.state) {
        if (!state.waitForScroll) {
            this.setState({ ...state, waitForScroll: true });
        }
    }

    stopScrollWaiting(state = this.state) {
        if (state.waitForScroll) {
            this.setState({ ...state, waitForScroll: false });
        }

        this.updateListPosition();
    }

    /* Assignes window and viewport event handlers */
    listenWindowEvents() {
        setTimeout(() => {
            this.stopScrollIgnore();
        }, IGNORE_SCROLL_TIMEOUT);

        if (this.state.listeningWindow) {
            return;
        }

        setEvents(window.visualViewport, this.viewportEvents);
        setEvents(window, this.windowEvents);

        this.setState({ ...this.state, listeningWindow: true });
    }

    /* Removes window and viewport event handlers */
    stopWindowEvents() {
        if (!this.state.listeningWindow) {
            return;
        }

        removeEvents(window.visualViewport, this.viewportEvents);
        removeEvents(window, this.windowEvents);

        this.setState({ ...this.state, listeningWindow: false });
    }

    /** Add focus/blur event handlers to root element of component */
    assignCommonHandlers() {
        setEvents(this.elem, this.commonEvents, { capture: true });
    }

    /** Remove focus/blur event handlers from root element of component */
    removeCommonHandlers() {
        removeEvents(this.elem, this.commonEvents, { capture: true });
    }

    /** viewPort 'resize' event handler */
    onWindowScroll() {
        if (this.state.waitForScroll) {
            this.showListHandler();
            return;
        }

        if (this.state.ignoreScroll) {
            return;
        }

        this.updateListPosition();
    }

    /** viewPort 'resize' event handler */
    onViewportResize() {
        if (this.state.waitForScroll) {
            this.showListHandler();
            return;
        }

        this.updateListPosition();
    }

    /** List item 'click' event handler */
    onListItemClick(itemId) {
        const item = this.getItem(itemId);
        this.handleItemSelect(item);
    }

    /** Handler of 'change' event of native select */
    onChange() {
        if (!this.selectElem?.options) {
            return;
        }

        const selOptions = Array.from(this.selectElem.selectedOptions);
        const selValues = selOptions.map((option) => option.value);
        this.setSelection(selValues);

        this.sendItemSelectEvent();
        this.setChanged();
    }

    /** 'focus' event handler */
    onFocus(e) {
        if (this.state.disabled) {
            return;
        }

        this.activate(true);
        const input = this.getInput();

        const index = this.getSelectedItemIndex(e.target);
        if (index !== -1) {
            this.activateSelectedItem(index);
        } else if (e.target === input?.elem) {
            this.activateInput();
        }

        const focusedBefore = !!this.focusedElem;
        this.focusedElem = e.target;

        const blurOnSelect = (
            !this.props.multiple
            && this.props.blurInputOnSingleSelect
        );
        if (
            blurOnSelect
            && this.isMenuTarget(e.target)
        ) {
            return;
        }

        this.listenWindowEvents();
        if (this.state.openOnFocus && !this.state.visible && !focusedBefore) {
            this.showList(true);
            this.startScrollWaiting();
            this.showListHandler();
        }

        if (
            index === -1
            && !this.isClearButtonTarget(e.target)
            && (!blurOnSelect || !focusedBefore)
        ) {
            this.focusInputIfNeeded();
        }
    }

    /** 'blur' event handler */
    onBlur(e) {
        const lostFocus = (
            !this.isChildTarget(e.relatedTarget)
            && !this.isMenuTarget(e.relatedTarget)
        );
        if (lostFocus) {
            this.focusedElem = null;
            this.stopScrollWaiting();
            this.activate(false);
        }

        if (e.target === this.selectElem) {
            this.sendChangeEvent();
        }
    }

    /** Click by delete button of selected item event handler */
    onDeleteSelectedItem(e) {
        if (!this.props.multiple || !e) {
            return;
        }

        const isClick = (e.type === 'click');
        if (isClick && !this.isSelectionItemDeleteButtonTarget(e.target)) {
            return;
        }

        const index = (isClick)
            ? this.getSelectedItemIndex(e.target)
            : this.state.actSelItemIndex;
        if (index === -1) {
            return;
        }

        const selectedItems = this.getSelectedItems();
        if (!selectedItems.length) {
            return;
        }

        e.stopPropagation();

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
        this.setChanged();
        this.sendChangeEvent();
    }

    /** 'keydown' event handler */
    onKey(e) {
        e.stopPropagation();

        const editable = this.isEditable();
        const { multiple } = this.props;
        const input = this.getInput();
        let newItem = null;

        let allowSelectionNavigate = multiple;
        if (multiple && editable && e.target === input.elem) {
            // Check cursor is at start of input
            const cursorPos = getCursorPos(input.elem);
            if (cursorPos?.start !== 0 || cursorPos.start !== cursorPos.end) {
                allowSelectionNavigate = false;
            }
        }

        // Backspace or Arrow Left key on container or text input
        // Activate last multiple selection item
        if (
            allowSelectionNavigate
            && (e.code === 'Backspace' || e.code === 'ArrowLeft')
            && (this.state.actSelItemIndex === -1)
        ) {
            this.activateLastSelectedItem();
            return;
        }

        if (allowSelectionNavigate && (e.code === 'Backspace' || e.code === 'Delete')) {
            if (e.code === 'Delete' && this.state.actSelItemIndex === -1) {
                return;
            }

            this.onDeleteSelectedItem(e);
            e.preventDefault();
            return;
        }

        if (allowSelectionNavigate && (e.code === 'ArrowLeft' || e.code === 'ArrowRight')) {
            if (e.code === 'ArrowRight' && this.state.actSelItemIndex === -1) {
                return;
            }

            this.onSelectionNavigate(e);
            e.preventDefault();
            return;
        }

        const activeItem = this.getActiveItem();
        let focusInput = false;

        if (e.code === 'Space' && !editable) {
            this.toggleList();
            e.preventDefault();
        } else if (e.code === 'ArrowDown') {
            const availItems = this.getAvailableItems(this.state);

            if (!this.state.visible && !activeItem) {
                this.showList(true);
                focusInput = true;
                [newItem] = availItems;
            } else if (this.state.visible) {
                if (activeItem) {
                    newItem = this.getNextAvailableItem(activeItem.id);
                } else if (availItems.length > 0) {
                    [newItem] = availItems;
                }
            }
        } else if (e.code === 'ArrowUp') {
            if (this.state.visible) {
                if (activeItem) {
                    newItem = this.getPrevAvailableItem(activeItem.id);
                }
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
        } else if (e.key === 'Enter') {
            if (activeItem) {
                this.handleItemSelect(activeItem);
            }

            e.preventDefault();
        } else if (e.code === 'Escape') {
            this.showList(false);
            this.elem.focus();
        } else {
            return;
        }

        if (newItem) {
            this.setActive(newItem.id);
            this.menu.scrollToItem(newItem);
            e.preventDefault();
        }

        if (focusInput) {
            this.focusInputIfNeeded();
        }
    }

    /** Handler for left or right arrow keys */
    onSelectionNavigate(e) {
        if (!this.props.multiple) {
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

    /** 'click' event handler */
    onClick(e) {
        if (e.type === 'touchstart') {
            this.setState({ ...this.state, isTouch: true });
            return;
        }

        if (
            this.state.waitForScroll
            || this.isMenuTarget(e.target)
            || this.isClearButtonTarget(e.target)
            || this.isSelectionItemDeleteButtonTarget(e.target)
            || !this.isValidToggleTarget(e.target)
        ) {
            return;
        }

        this.toggleList();

        if (!this.props.openOnFocus) {
            this.focusInputIfNeeded();
        }
    }

    setRenderTime() {
        this.setState({ ...this.state, renderTime: Date.now() });
    }

    /** Handler for 'input' event of text field  */
    onInput(e) {
        if (this.props.enableFilter) {
            this.filter(e.target.value);
        }

        if (isFunction(this.props.onInput)) {
            this.props.onInput(e);
        }

        this.setRenderTime();
    }

    /** Handler for 'clear selection' button click */
    onClear() {
        if (!this.props.multiple) {
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

        if (this.props.enableFilter) {
            this.focusInputIfNeeded();
        } else {
            this.elem.focus();
        }
    }

    /** Handles user item select event */
    handleItemSelect(item) {
        if (!item || item.disabled) {
            return;
        }

        if (item.id === this.state.createFromInputItemId) {
            this.handlePlaceholderSelect();
            return;
        }

        this.activateSelectedItem(-1);
        this.toggleItem(item.id);
        this.sendItemSelectEvent();
        this.setChanged();

        if (!this.props.multiple) {
            this.showList(false);
            if (this.props.enableFilter && this.state.filtered) {
                this.showAllItems();
            }

            this.elem.focus();
        } else if (this.props.enableFilter) {
            if (this.state.filtered) {
                const visibleItems = this.getVisibleItems();
                if (
                    this.props.clearFilterOnMultiSelect
                    || visibleItems.length === 1
                ) {
                    this.showAllItems();
                }
            }

            setTimeout(() => this.focusInputIfNeeded());
        }
    }

    handlePlaceholderSelect() {
        const { allowCreate, inputString } = this.state;

        if (
            !allowCreate
            || !(inputString?.length > 0)
        ) {
            return;
        }

        this.removeCreatableMenuItem();
        this.addItem({
            id: this.menu.generateItemId(),
            title: inputString,
            selected: true,
        });

        this.activateSelectedItem(-1);
        this.sendItemSelectEvent();
        this.setChanged();

        this.showList(false);
        if (this.props.enableFilter && this.state.filtered) {
            this.showAllItems();
        }
    }

    removeCreatableMenuItem() {
        if (!this.state.createFromInputItemId) {
            return;
        }

        this.setState({
            ...this.state,
            createFromInputItemId: null,
            items: this.state.items.filter((item) => item.id !== this.state.createFromInputItemId),
        });
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
        return getVisibleItems(state);
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
        return getSelectedItems(state);
    }

    /** Return list item object which list element contains specified element */
    getItemByElem(elem) {
        const li = elem?.closest('li');
        if (!li) {
            return null;
        }
        return this.getItem(li.dataset.id);
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
            inputString: (val) ? this.state.inputString : null,
            active: (val) ? true : this.state.active,
            items: newItems,
        });

        if (val) {
            setEmptyClick(
                this.emptyClickHandler,
                [
                    this.menu.elem,
                    (this.props.listAttach) ? this.hostElem : this.combo.elem,
                ],
            );
        } else {
            removeEmptyClick(this.emptyClickHandler);

            this.sendChangeEvent();
        }
    }

    /** Setup tabindexes of component */
    setTabIndexes(state) {
        if (state.disabled) {
            this.elem.removeAttribute('tabindex');
            this.selectElem.removeAttribute('tabindex');
            return;
        }

        const nativeSelectVisible = isVisible(this.selectElem, true);
        const editable = this.isEditable(state);

        this.selectElem.setAttribute('tabindex', (nativeSelectVisible) ? 0 : -1);
        this.elem.setAttribute('tabindex', (nativeSelectVisible || editable) ? -1 : 0);
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
        if (this.state.disabled) {
            return;
        }
        // Flush filter
        if (!this.state.visible && this.state.filtered) {
            this.showAllItems();
        }

        this.showList(!this.state.visible);
        if (!this.state.visible) {
            this.elem.focus();
        }
    }

    /** Activate or deactivate component */
    activate(val) {
        if (this.state.active === val) {
            return;
        }

        if (!val) {
            this.showList(false);
        }

        this.removeCreatableMenuItem();
        this.setState({
            ...this.state,
            active: val,
            actSelItemIndex: -1,
            filtered: false,
            inputString: null,
            items: this.state.items.map((item) => ({
                ...item,
                active: false,
            })),
        });
    }

    activateInput() {
        if (!this.isEditable()) {
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
        }

        this.setState(newState);
    }

    getInput() {
        if (this.props.listAttach) {
            return this.menu.header?.input;
        }

        return this.combo.input;
    }

    focusInputIfNeeded() {
        const input = this.getInput();
        if (!input) {
            return;
        }

        if (
            this.props.enableFilter
            && this.focusedElem !== input.elem
            && this.state.actSelItemIndex === -1
        ) {
            input.focus();
        }
    }

    /** Check specified element is child of some selected item element */
    isSelectedItemElement(elem) {
        const selectionElem = this.combo?.multipleSelection?.elem;
        return elem && selectionElem?.contains(elem);
    }

    /** Returns true if element is child of component */
    isChildTarget(elem) {
        return elem && this.elem.contains(elem);
    }

    /** Returns true if element is list or its child */
    isMenuTarget(elem) {
        const menu = this.menu?.elem;
        return elem && (elem === menu || menu?.contains(elem));
    }

    /** Returns true if element is clear button or its child */
    isClearButtonTarget(elem) {
        const btn = this.combo?.clearBtn?.elem;
        return elem && (elem === btn || btn?.contains(elem));
    }

    /** Returns true if element is delete selection item button or its child */
    isSelectionItemDeleteButtonTarget(elem) {
        const { MultiSelectionItem } = this.props.components;
        return elem?.closest(`.${MultiSelectionItem.buttonClass}`);
    }

    /** Returns true if element is allowed to toggle menu list */
    isValidToggleTarget(elem) {
        return (
            !isFunction(this.props.isValidToggleTarget)
            || this.props.isValidToggleTarget(elem)
        );
    }

    /** Return selected items data for 'itemselect' and 'change' events */
    getSelectionData() {
        const selectedItems = this.getSelectedItems()
            .map((item) => ({ id: item.id, value: item.title }));

        if (this.props.multiple) {
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

        this.setState({ ...this.state, changed: false });
    }

    /** Toggle item selected status */
    toggleItem(itemId) {
        const item = this.getItem(itemId);
        if (!item) {
            return;
        }

        if (item.selected && this.props.multiple) {
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
                selected: (this.props.multiple)
                    ? (item.selected || item.id === strId)
                    : (item.id === strId),
            })),
        });
    }

    /** Deselect specified item */
    deselectItem(itemId) {
        if (!this.props.multiple) {
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
        if (!this.props.multiple && itemIds.length !== 1) {
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

    /** Sets changed flag */
    setChanged() {
        this.setState({ ...this.state, changed: true });
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
        if (this.state.disabled || !this.props.multiple) {
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
                    this.focusInputIfNeeded();
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
    showAllItems(resetInput = true) {
        this.setState({
            ...this.state,
            filtered: false,
            inputString: (resetInput) ? null : '',
            createFromInputItemId: null,
            items: this.state.items
                .filter((item) => item.id !== this.state.createFromInputItemId)
                .map((item) => ({
                    ...item,
                    active: false,
                })),
        });
    }

    /** Show only items containing specified string */
    filter(inputString) {
        if (this.state.inputString === inputString) {
            return;
        }

        if (inputString.length === 0) {
            this.showAllItems(false);
            return;
        }

        const lfstr = inputString.toLowerCase();
        let exactMatch = false;
        const items = [];
        const { createFromInputItemId } = this.state;
        let createFromInputItem = null;

        for (let index = 0; index < this.state.items.length; index += 1) {
            const item = this.state.items[index];
            if (createFromInputItemId && item.id === createFromInputItemId) {
                createFromInputItem = { ...item };
                continue;
            }

            exactMatch = exactMatch || item.title.toLowerCase() === lfstr;

            items.push({
                ...item,
                matchFilter: item.title.toLowerCase().includes(lfstr),
                active: false,
            });
        }

        const newState = {
            ...this.state,
            inputString,
            filtered: true,
            visible: true,
            items,
        };

        if (this.state.allowCreate) {
            if (exactMatch && newState.createFromInputItemId) {
                newState.createFromInputItemId = null;
            } else if (!exactMatch && !newState.createFromInputItemId) {
                newState.createFromInputItemId = this.menu.generateItemId();

                const newItem = this.createItem({
                    id: newState.createFromInputItemId,
                    ...this.renderAddMessage(newState),
                    matchFilter: true,
                });

                newState.items.push(newItem);
            } else if (!exactMatch && newState.createFromInputItemId) {
                const newItem = {
                    ...createFromInputItem,
                    ...this.renderAddMessage(newState),
                };

                newState.items.push(newItem);
            }
        }

        this.setState(newState);
    }

    /**
     * Fix multiple select issues on iOS safari
     * @param {Element} elem - select element
     */
    fixIOS(elem) {
        if (!elem || elem.tagName !== 'SELECT' || !this.props.multiple) {
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

        const items = [];
        const groups = [];

        for (let i = 0, l = elem.children.length; i < l; i += 1) {
            const childElem = elem.children[i];
            if (childElem.tagName === 'OPTGROUP') {
                const group = this.createGroup({ title: childElem.label }, groups);
                if (!group) {
                    return false;
                }
                groups.push(group);

                for (let ci = 0, cl = childElem.children.length; ci < cl; ci += 1) {
                    const groupChild = childElem.children[ci];
                    const item = this.parseOption(groupChild, group);
                    if (!item) {
                        return false;
                    }
                    items.push(item);
                }
            } else if (childElem.tagName === 'OPTION') {
                const item = this.parseOption(childElem, null);
                if (!item) {
                    return false;
                }
                items.push(item);
            }
        }

        this.state.items = items;
        this.state.groups = groups;

        // For single select check only one item is selected
        if (!this.props.multiple) {
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
        if (!newItems) {
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
    addGroup(options) {
        const group = this.createGroup(options);
        if (!group) {
            return null;
        }

        this.state.groups.push(group);

        return group;
    }

    generateMenuId() {
        while (true) {
            const id = `${Date.now()}${Math.random() * 10000}`;
            const found = DropDown.menuIds.includes(id);
            if (!found) {
                DropDown.menuIds.push(id);
                return id;
            }
        }
    }

    generateGroupId(groups) {
        while (true) {
            const id = `group${Date.now()}${Math.random() * 10000}`;
            const found = groups.find((item) => item.id === id);
            if (!found) {
                return id;
            }
        }
    }

    /**
     * Create new group
     * @param {string} label
     */
    createGroup(options = {}, groups = []) {
        const { title, disabled = false } = options;

        const group = {
            id: options.id?.toString() ?? this.generateGroupId(groups),
            type: 'group',
            title,
            disabled,
        };

        return group;
    }

    getGroupById(id) {
        const strId = id?.toString();
        return this.state.groups.find((item) => item.id === strId);
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
        this.removeCreatableMenuItem();
        this.setState({
            ...this.state,
            items: [],
        });
    }

    /** Set active state for specified list item */
    setActive(itemId) {
        const itemToActivate = this.getItem(itemId);
        const activeItem = this.getActiveItem();
        if (
            (activeItem === itemToActivate && (activeItem || itemToActivate))
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

    /**
     * Search for last selected item to leave selection only on it
     * If not found select first item
     * @param {Array} items
     * @returns
     */
    processSingleSelection(items) {
        if (this.props.multiple) {
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

    getGroupItems(group, state = this.state) {
        return getGroupItems(group, state);
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

    renderNotFound() {
        return {
            selectable: false,
            content: this.props.noResultsMessage,
        };
    }

    renderAddMessage(state) {
        const title = state?.inputString;
        const message = (isFunction(this.props.addItemMessage))
            ? this.props.addItemMessage(title)
            : this.props.addItemMessage;

        if (typeof message !== 'string') {
            throw new Error('Invalid message');
        }

        return {
            title: message,
            selectable: true,
            type: 'button',
            className: CREATE_ITEM_CLASS,
        };
    }

    renderListContent(state, prevState) {
        if (
            state.items === prevState.items
            && state.visible === prevState.visible
            && state.filtered === prevState.filtered
            && state.renderTime === prevState.renderTime
        ) {
            return;
        }

        const items = [];
        const groups = [];

        state.items.forEach((item) => {
            if (
                item.hidden
                || (state.filtered && !item.matchFilter)
            ) {
                return;
            }

            if (!item.group) {
                items.push(item);
                return;
            }

            if (groups.includes(item.group.id)) {
                return;
            }

            const groupItem = {
                ...item.group,
                type: 'group',
                items: getVisibleGroupItems(item.group, state),
            };
            groups.push(item.group.id);
            items.push(groupItem);
        });

        this.menu.setState((menuState) => ({
            ...menuState,
            items,
            renderTime: state.renderTime,
            listScroll: (prevState.visible) ? menuState.listScroll : 0,
            header: {
                ...menuState.header,
                items: state.items,
                inputPlaceholder: this.props.placeholder,
                inputString: state.inputString,
            },
        }));
    }

    isFullScreen() {
        return (this.props.fullScreen && !this.elem.offsetParent);
    }

    setFullScreenContainerHeight() {
        const screenHeight = window.visualViewport.height;
        this.elem.style.height = px(screenHeight);
    }

    renderFullscreenList(state) {
        if (!state.visible || this.props.listAttach) {
            return;
        }

        ScrollLock.lock();

        this.setFullScreenContainerHeight();
    }

    updateListPosition() {
        if (
            !this.state.visible
            || isVisible(this.selectElem, true)
        ) {
            return;
        }

        if (this.isFullScreen()) {
            this.setFullScreenContainerHeight();
            return;
        }

        PopupPosition.calculate({
            elem: this.menu.elem,
            refElem: this.elem,
            margin: LIST_MARGIN,
            screenPadding: SCREEN_PADDING,
            useRefWidth: true,
            minRefHeight: this.getMinRefHeight(),
            scrollOnOverflow: false,
            allowResize: false,
            allowFlip: false,
        });
    }

    getMinRefHeight() {
        if (this.props.listAttach) {
            return ATTACH_REF_HEIGHT;
        }

        const borderWidth = this.combo.elem.offsetHeight - this.combo.elem.clientHeight;
        const ref = this.combo.toggleBtn ?? this.combo.input ?? this.combo;
        return ref.elem.offsetHeight + borderWidth;
    }

    renderList(state, prevState) {
        // Skip render if currently native select is visible
        if (isVisible(this.selectElem, true)) {
            return;
        }

        if (this.props.fixedMenu) {
            this.menu.elem.classList.toggle(MENU_OPEN_CLASS, state.visible);
        } else {
            this.elem.classList.toggle(LIST_OPEN_CLASS, state.visible);
        }
        this.renderListContent(state, prevState);

        if (
            state.items === prevState.items
            && state.visible === prevState.visible
            && state.filtered === prevState.filtered
        ) {
            return;
        }

        if (!state.visible) {
            if (this.props.fullScreen) {
                ScrollLock.unlock();
                this.elem.style.height = '';
            }

            PopupPosition.reset(this.menu.elem);
            setTimeout(() => this.stopWindowEvents());
            return;
        }

        if (this.isFullScreen()) {
            this.renderFullscreenList(state, prevState);
            setTimeout(() => this.listenWindowEvents());
        } else {
            this.startScrollIgnore(state);
            const editable = this.isEditable(state);
            const allowScrollAndResize = !state.isTouch || !editable;

            PopupPosition.calculate({
                elem: this.menu.elem,
                refElem: this.elem,
                margin: LIST_MARGIN,
                screenPadding: SCREEN_PADDING,
                useRefWidth: true,
                minRefHeight: this.getMinRefHeight(),
                scrollOnOverflow: allowScrollAndResize,
                allowResize: allowScrollAndResize,
                allowFlip: false,
                onScrollDone: () => this.listenWindowEvents(),
            });
        }
    }

    render(state, prevState = {}) {
        this.elem.classList.toggle(ACTIVE_CLASS, !!state.active);

        const editable = this.isEditable(state);
        this.elem.classList.toggle(EDITABLE_CLASS, editable);

        if (this.props.fixedMenu) {
            this.menu.elem.classList.toggle(MENU_ACTIVE_CLASS, !!state.active);
        }

        if (state.disabled !== prevState?.disabled) {
            enable(this.elem, !state.disabled);
            if (state.disabled) {
                this.removeCommonHandlers();
            } else {
                this.assignCommonHandlers();
            }

            enable(this.selectElem, !state.disabled);
        }

        this.setTabIndexes(state);
        this.renderSelect(state, prevState);

        if (this.combo) {
            this.combo.setState((comboState) => ({
                ...comboState,
                editable,
                disabled: state.disabled,
                items: state.items,
                actSelItemIndex: state.actSelItemIndex,
                inputString: state.inputString,
            }));
        }

        this.renderList(state, prevState);
    }
}
