import { isFunction, asArray } from '@jezvejs/types';
import {
    createElement,
    re,
    insertAfter,
    prependChild,
    isVisible,
    getCursorPos,
    setEvents,
    removeEvents,
    enable,
} from '@jezvejs/dom';
import {
    px,
    debounce,
} from '../../js/common.js';
import { setEmptyClick, removeEmptyClick } from '../../js/emptyClick.js';
import { Component } from '../../js/Component.js';

import { MenuCheckbox } from '../Menu/Menu.js';
import { PopupPosition } from '../PopupPosition/PopupPosition.js';
import { ScrollLock } from '../ScrollLock/ScrollLock.js';
import { combineReducers, createStore } from '../Store/Store.js';

import {
    findMenuItem,
    getItemById,
    getSelectedItems,
    isVisibleItem,
    getVisibleItems,
    getGroupItems,
    getVisibleGroupItems,
    toFlatList,
    getPreviousItem,
    getNextItem,
    getGroupById,
    filterItems,
    forItems,
    mapItems,
    pushItem,
    createMenuItem,
} from './utils.js';

import { DropDownInput } from './components/Input/Input.js';
/* Combo box */
import { DropDownComboBox } from './components/Combo/ComboBox/ComboBox.js';
import { DropDownSingleSelection } from './components/Combo/SingleSelection/SingleSelection.js';
import { DropDownMultipleSelection } from './components/Combo/MultipleSelection/MultipleSelection.js';
import { DropDownMultiSelectionItem } from './components/Combo/MultiSelectionItem/MultiSelectionItem.js';
import { DropDownPlaceholder } from './components/Combo/Placeholder/Placeholder.js';
import { DropDownClearButton } from './components/Combo/ClearButton/ClearButton.js';
import { DropDownToggleButton } from './components/Combo/ToggleButton/ToggleButton.js';
/* Menu */
import { DropDownMenu } from './components/Menu/Menu/Menu.js';
import { DropDownMenuHeader } from './components/Menu/MenuHeader/MenuHeader.js';
import { DropDownMenuList } from './components/Menu/MenuList/MenuList.js';
import { DropDownListItem } from './components/Menu/ListItem/ListItem.js';
import { DropDownGroupItem } from './components/Menu/GroupItem/GroupItem.js';
import { DropDownGroupHeader } from './components/Menu/GroupHeader/GroupHeader.js';
import { DropDownListPlaceholder } from './components/Menu/ListPlaceholder/ListPlaceholder.js';

import {
    actions,
    createGroup,
    createItem,
    createItems,
    getAvailableItems,
    isAvailableItem,
    reducer,
} from './reducer.js';
import '../../css/common.scss';
import './DropDown.scss';

export {
    /* Child components */
    /* Combobox */
    DropDownComboBox,
    DropDownInput,
    DropDownPlaceholder,
    DropDownSingleSelection,
    DropDownMultipleSelection,
    DropDownMultiSelectionItem,
    DropDownToggleButton,
    DropDownClearButton,
    /* Menu */
    DropDownMenu,
    DropDownMenuList,
    DropDownListItem,
    DropDownGroupItem,
    DropDownGroupHeader,
    DropDownListPlaceholder,
    /* utils */
    findMenuItem,
    getItemById,
    getSelectedItems,
    isVisibleItem,
    getVisibleItems,
    getGroupItems,
    getVisibleGroupItems,
    toFlatList,
    forItems,
    mapItems,
    pushItem,
    createMenuItem,
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

const IGNORE_SCROLL_TIMEOUT = 1;
const SHOW_LIST_SCROLL_TIMEOUT = 100;
const INPUT_FOCUS_TIMEOUT = 100;

/** Default properties */
const defaultProps = {
    /* DropDown container element 'id' property */
    id: undefined,
    /* Select element 'name' property */
    name: undefined,
    /* Select element 'form' property */
    form: undefined,
    /* Additional CSS classes */
    className: null,
    /* Identifier or element to attach DropDown component to */
    elem: undefined,
    /* allow to select multiple items */
    multiple: false,
    /* attach menu to element and don't create combo box */
    listAttach: false,
    /* If enabled component container will use static position */
    static: false,
    /* Callback to verity element to toggle menu list popup */
    isValidToggleTarget: null,
    /* If enabled menu will use fixed position or absolute otherwise */
    fixedMenu: false,
    /* Enables filtering items by text input */
    enableFilter: false,
    /* If enabled menu will be opened on component receive focus */
    openOnFocus: false,
    /* If enabled then after last item will be activated first and vice versa */
    loopNavigation: true,
    /* Title for empty menu list placeholder */
    noResultsMessage: 'No items',
    /* Enables create new items from filter input value */
    allowCreate: false,
    /* Enabled activation of group headers and includes its to item iterations */
    allowActiveGroupHeader: false,
    /* Callback returning title for 'Create from filter' menu item */
    addItemMessage: (title) => `Add item: '${title}'`,
    /* Disabled any interactions with component */
    disabled: false,
    /* If enabled component will use native select element on
       small devices(less 768px width) to view list and edit selection */
    useNativeSelect: false,
    /* if set true component will show fullscreen popup */
    fullScreen: false,
    /* Placeholder text for component */
    placeholder: null,
    /* Additional reducers */
    reducers: null,
    /* If enabled single select component will move focus from input to container
       after select item */
    blurInputOnSingleSelect: true,
    /* If enabled single select component will use title of selected item as placeholder */
    useSingleSelectionAsPlaceholder: true,
    /* If enabled multiple select component will clear filter input after select item */
    clearFilterOnMultiSelect: false,
    /* Enables render multiple selection inside combo box */
    showMultipleSelection: true,
    /* Enables render 'clear multiple selection' button inside combo box */
    showClearButton: true,
    /* Enables render 'toggle' button inside combo box */
    showToggleButton: true,
    /* item selected event handler */
    onItemSelect: null,
    /* selection changed event handler */
    onChange: null,
    /* filer input event handler */
    onInput: null,
    components: {
        Input: DropDownInput,
        Placeholder: DropDownPlaceholder,
        SingleSelection: DropDownSingleSelection,
        ComboBox: DropDownComboBox,
        Menu: DropDownMenu,
        MenuList: DropDownMenuList,
        ListItem: DropDownListItem,
        Check: MenuCheckbox,
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
 * Drop Down component
 */
export class DropDown extends Component {
    static userProps = {
        elem: ['id'],
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
        this.inputElem = null;
        this.focusedElem = null;
        if (this.hostElem?.tagName === 'SELECT') {
            this.selectElem = this.hostElem;
        }
        if (!this.hostElem) {
            this.props.listAttach = false;
        }
        this.renderInProgress = false;

        // Callbacks
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
        this.focusInputHandler = debounce(
            () => this.focusInputIfNeeded(true),
            INPUT_FOCUS_TIMEOUT,
        );

        // Setup store
        const extraReducers = asArray(this.props.reducers);
        const storeReducer = (extraReducers.length > 0)
            ? combineReducers(reducer, ...extraReducers)
            : reducer;
        this.store = createStore(storeReducer, {
            initialState: this.getInitialState(),
        });

        this.init();
        this.postInit();

        if (this.props.data) {
            this.store.dispatch(actions.append(this.props.data));
        }
    }

    getInitialState() {
        const disabled = (
            this.props.disabled
            || (!this.props.listAttach && !!this.hostElem?.disabled)
        );

        let initialState = {
            active: false,
            changed: false,
            visible: false,
            inputString: null,
            filtered: false,
            multiple: this.props.multiple,
            openOnFocus: this.props.openOnFocus,
            allowCreate: this.props.allowCreate,
            allowActiveGroupHeader: this.props.allowActiveGroupHeader,
            addItemMessage: this.props.addItemMessage,
            disabled,
            items: [],
            actSelItemIndex: -1,
            menuId: this.generateMenuId(),
            isTouch: false,
            ignoreScroll: false,
            listeningWindow: false,
            waitForScroll: false,
            renderTime: Date.now(),
            createItem: (item, state) => createMenuItem(item, state),
            isAvailableItem: (item, state) => this.isAvailableItem(item, state),
            components: {
                ...this.props.components,
            },
        };

        if (this.selectElem) {
            initialState = this.parseSelect(this.selectElem, initialState);
        }

        return initialState;
    }

    setState(state) {
        this.store.setState(state);
    }

    init() {
        if (this.props.listAttach) {
            this.attachToElement();
        } else {
            this.attachToInput();
        }

        this.elem.classList.toggle(NATIVE_CLASS, !!this.props.useNativeSelect);
        this.elem.classList.toggle(FULLSCREEN_CLASS, !!this.props.fullScreen);

        this.elem.dataset.target = this.state.menuId;

        this.createList();
        setEvents(this.selectElem, { change: (e) => this.onChange(e) });

        this.createCombo();
    }

    postInit() {
        this.setUserProps();
        this.setClassNames();
        this.subscribeToStore(this.store);
    }

    /** Returns current state object */
    get state() {
        return this.store.getState();
    }

    /** Return array of all list items */
    get items() {
        return structuredClone(this.state.items);
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

        this.elem.classList.toggle(STATIC_CLASS, this.props.static);
    }

    /** Attach DropDown to specified element */
    attachToElement() {
        this.elem = createElement('div', { props: { className: ATTACHED_CLASS } });
        insertAfter(this.elem, this.hostElem);
        this.elem.append(this.hostElem);

        this.createSelect();

        this.elem.append(this.hostElem, this.selectElem);

        return true;
    }

    /** Creates select element */
    createSelect() {
        this.selectElem = createElement('select');
    }

    /** Returns initial props for combo box component */
    getComboBoxProps() {
        const {
            Input,
            SingleSelection,
            Placeholder,
            MultipleSelection,
            MultiSelectionItem,
            ToggleButton,
            ClearButton,
        } = this.props.components;
        const {
            placeholder,
            useSingleSelectionAsPlaceholder,
            showMultipleSelection,
            showClearButton,
            showToggleButton,
            enableFilter,
        } = this.props;
        const {
            multiple,
            disabled,
            items,
            actSelItemIndex,
            inputString,
        } = this.state;

        return {
            inputElem: this.inputElem,
            multiple,
            placeholder,
            useSingleSelectionAsPlaceholder,
            showMultipleSelection,
            showClearButton,
            showToggleButton,
            editable: this.isEditable(),
            enableFilter,
            disabled,
            items,
            actSelItemIndex,
            inputString,
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
        };
    }

    /** Creates combo box */
    createCombo() {
        if (this.props.listAttach) {
            return;
        }

        const { ComboBox } = this.props.components;

        const comboProps = this.getComboBoxProps();
        this.combo = ComboBox.create(comboProps);
        this.elem.appendChild(this.combo.elem);
    }

    getMenuProps() {
        const {
            placeholder,
            useSingleSelectionAsPlaceholder,
            fixedMenu,
        } = this.props;
        const { Input } = this.props.components;
        const {
            multiple,
            menuId,
            renderTime,
        } = this.state;

        const showInput = this.props.listAttach && this.props.enableFilter;

        return {
            parentId: menuId,
            className: (fixedMenu) ? FIXED_LIST_CLASS : null,
            multiple,
            defaultItemType: (multiple) ? 'checkbox' : 'button',
            tabThrough: false,
            getItemById: (id) => this.getItem(id),
            getPlaceholderProps: (state) => this.renderNotFound(state),
            onItemClick: (id) => this.onListItemClick(id),
            onItemActivate: (id) => this.setActive(id),
            onPlaceholderClick: () => this.handlePlaceholderSelect(),
            isLostFocus: (e) => this.isLostFocus(e),
            onMouseLeave: (e) => this.onMouseLeave(e),
            renderTime,
            header: {
                inputElem: this.inputElem,
                inputPlaceholder: placeholder,
                useSingleSelectionAsPlaceholder,
                multiple,
                onInput: (e) => this.onInput(e),
                components: {
                    Input,
                },
            },
            components: {
                ...this.props.components,
                Header: (showInput) ? DropDownMenuHeader : null,
            },
        };
    }

    /** Creates list element */
    createList() {
        const { Menu } = this.props.components;

        const menuProps = this.getMenuProps();
        this.menu = Menu.create(menuProps);

        if (this.props.fixedMenu) {
            document.body.append(this.menu.elem);
        } else {
            this.elem.append(this.menu.elem);
        }
    }

    startScrollIgnore() {
        this.store.dispatch(actions.startScrollIgnore());
    }

    stopScrollIgnore() {
        this.store.dispatch(actions.stopScrollIgnore());
    }

    startScrollWaiting() {
        this.store.dispatch(actions.startScrollWaiting());
    }

    stopScrollWaiting() {
        this.store.dispatch(actions.stopScrollWaiting());
        this.updateListPosition();
    }

    /* Assignes window and viewport event handlers */
    listenWindowEvents() {
        if (this.state.listeningWindow) {
            return;
        }

        setEvents(window.visualViewport, this.viewportEvents);
        setEvents(window, this.windowEvents);

        this.store.dispatch(actions.startWindowListening());
    }

    /* Removes window and viewport event handlers */
    stopWindowEvents() {
        if (!this.state.listeningWindow) {
            return;
        }

        removeEvents(window.visualViewport, this.viewportEvents);
        removeEvents(window, this.windowEvents);

        this.store.dispatch(actions.stopWindowListening());
    }

    /** Add focus/blur event handlers to root element of component */
    assignCommonHandlers() {
        setEvents(this.elem, this.commonEvents, { capture: true });
    }

    /** Remove focus/blur event handlers from root element of component */
    removeCommonHandlers() {
        removeEvents(this.elem, this.commonEvents, { capture: true });
    }

    /** Window 'scroll' event handler */
    onWindowScroll(e) {
        if (
            this.menu.elem
            && !e.target.contains(this.menu.elem)
            && !e.target.contains(this.elem)
        ) {
            return;
        }

        if (this.state.waitForScroll) {
            this.showListHandler();
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

        if (
            !this.state.multiple
            && this.props.blurInputOnSingleSelect
            && e.target === this.elem
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
        ) {
            this.focusInputHandler();
        }
    }

    /** 'blur' event handler */
    onBlur(e) {
        if (
            this.renderInProgress
            || this.menu?.renderInProgress
        ) {
            return;
        }

        if (this.isLostFocus(e)) {
            this.focusedElem = null;
            this.stopScrollWaiting();
            this.activate(false);
        }

        if (e.target === this.selectElem) {
            this.sendChangeEvent();
        }
    }

    /**
     * Returns true if focus moved outside of component
     *
     * @param {Event} e event object
     * @returns {Boolean}
     */
    isLostFocus(e) {
        return !this.isChildElement(e.relatedTarget);
    }

    /**
     * Returns true if component is containing specified element
     *
     * @param {Element} elem
     * @returns {Boolean}
     */
    isChildElement(elem) {
        return (
            !!elem
            && (
                this.isChildTarget(elem)
                || this.isMenuTarget(elem)
            )
        );
    }

    /** 'mouseleave' event handler */
    onMouseLeave() {
        const focused = document.activeElement;
        if (this.isChildElement(focused)) {
            this.elem.focus({ preventScroll: true });
        }
    }

    /** Click by delete button of selected item event handler */
    onDeleteSelectedItem(e) {
        if (!this.state.multiple || !e) {
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
        const { multiple, showMultipleSelection, listAttach } = this.props;
        const input = this.getInput();
        let newItem = null;

        let allowSelectionNavigate = multiple && showMultipleSelection && !listAttach;
        if (allowSelectionNavigate && editable && e.target === input.elem) {
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
                    if (this.props.loopNavigation && !newItem) {
                        [newItem] = availItems;
                    }
                } else if (availItems.length > 0) {
                    [newItem] = availItems;
                }
            }
        } else if (e.code === 'ArrowUp') {
            const availItems = this.getAvailableItems(this.state);
            if (this.state.visible && activeItem) {
                newItem = this.getPrevAvailableItem(activeItem.id);
                if (this.props.loopNavigation && !newItem) {
                    newItem = availItems[availItems.length - 1];
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
            e.preventDefault();
            this.menu.activateItem(newItem.id);
        }

        if (focusInput) {
            this.focusInputIfNeeded();
        }
    }

    /** Handler for left or right arrow keys */
    onSelectionNavigate(e) {
        if (!this.state.multiple) {
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
            this.store.dispatch(actions.confirmTouch());
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
        this.store.dispatch(actions.setRenderTime());
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
        if (!this.state.multiple) {
            return;
        }

        this.store.dispatch(actions.deselectAll());
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

        if (!this.state.multiple) {
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
        this.store.dispatch(actions.removeCreatableMenuItem());
    }

    /* List items methods */

    /** Return list item object by id */
    getItem(itemId, state = this.state) {
        return getItemById(itemId, state.items);
    }

    /** Return active list item */
    getActiveItem(state = this.state) {
        return findMenuItem(state.items, (item) => item.active);
    }

    getFlatList(state = this.state) {
        return toFlatList(state.items, {
            includeGroupItems: state.allowActiveGroupHeader,
        });
    }

    /** Return index of list item by id */
    getItemIndex(itemId, state = this.state) {
        const strId = itemId?.toString();
        const flatList = this.getFlatList(state);
        return flatList.findIndex((item) => item.id === strId);
    }

    /**
     * Return previous list item to specified by id
     * @returns null in case specified list item is not found or on first position
     * @param {number} itemId - identifier of item to start looking from
     */
    getPrevItem(itemId, state = this.state) {
        const options = {
            includeGroupItems: this.state.allowActiveGroupHeader,
        };

        return getPreviousItem(itemId, state.items, null, options);
    }

    /**
     * Return next list item to specified by id
     * @returns null in case specified list item is not found or on last position
     * @param {number} itemId - identifier of item to start looking from
     */
    getNextItem(itemId, state = this.state) {
        const options = {
            includeGroupItems: state.allowActiveGroupHeader,
        };

        return getNextItem(itemId, state.items, null, options);
    }

    /** Return array of visible(not hidden) list items */
    getVisibleItems(state = this.state) {
        return getVisibleItems(state);
    }

    isAvailableItem(item, state = this.state) {
        return isAvailableItem(item, state);
    }

    /** Return array of visible and enabled list items */
    getAvailableItems(state = this.state) {
        return getAvailableItems(state);
    }

    /**
     * Return list item available to select prior to specified item
     * @returns null in case specified list item is not found or on first position
     * @param {number} itemId - identifier of item to start looking from
     */
    getPrevAvailableItem(itemId) {
        const options = {
            includeGroupItems: this.state.allowActiveGroupHeader,
        };
        const filter = (item, state) => this.isAvailableItem(item, state);

        return getPreviousItem(itemId, this.state.items, filter, options);
    }

    /**
     * Return list item available to select next to specified item
     * @returns null in case specified list item is not found or on last position
     * @param {number} itemId - identifier of item to start looking from
     */
    getNextAvailableItem(itemId) {
        const options = {
            includeGroupItems: this.state.allowActiveGroupHeader,
        };
        const filter = (item, state) => this.isAvailableItem(item, state);

        return getNextItem(itemId, this.state.items, filter, options);
    }

    /** Return array of selected items */
    getSelectedItems(state = this.state) {
        return getSelectedItems(state);
    }

    /** Show or hide drop down list */
    showList(val) {
        if (this.state.visible === val) {
            return;
        }

        this.store.dispatch(actions.toggleShowMenu());

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

        this.store.dispatch(actions.toggleEnable());
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

        this.setRenderTime();
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
        this.store.dispatch(actions.toggleActivate());
    }

    activateInput() {
        if (!this.isEditable()) {
            return;
        }

        this.store.dispatch(actions.activateInput());
    }

    getInput() {
        if (this.props.listAttach) {
            return this.menu.header?.input;
        }

        return this.combo.input;
    }

    focusInputIfNeeded(keepActiveItem = false) {
        const input = this.getInput();
        if (!input) {
            return;
        }

        const activeItem = (keepActiveItem) ? this.getActiveItem() : null;

        if (
            this.props.enableFilter
            && this.focusedElem !== input.elem
            && this.state.actSelItemIndex === -1
        ) {
            input.focus();

            if (activeItem) {
                this.setActive(activeItem.id);
            }
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

        if (this.state.multiple) {
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

        this.store.dispatch(actions.changeEventSent());
    }

    /** Toggle item selected status */
    toggleItem(itemId) {
        const item = this.getItem(itemId);
        if (!item) {
            return;
        }

        if (item.selected && this.state.multiple) {
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

        this.store.dispatch(actions.selectItem(strId));
    }

    /** Deselect specified item */
    deselectItem(itemId) {
        if (!this.state.multiple) {
            return;
        }

        const strId = itemId?.toString();
        const itemToDeselect = this.getItem(strId);
        if (!itemToDeselect?.selected) {
            return;
        }

        this.store.dispatch(actions.deselectItem(strId));
    }

    /** Sets items selection */
    setSelection(ids) {
        const itemIds = asArray(ids).map((id) => id?.toString());
        if (!this.state.multiple && itemIds.length !== 1) {
            return;
        }

        this.store.dispatch(actions.setSelection(itemIds));
    }

    /** Sets changed flag */
    setChanged() {
        this.store.dispatch(actions.setChanged());
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
        if (
            this.state.disabled
            || !this.state.multiple
            || (this.state.actSelItemIndex === index)
        ) {
            return;
        }

        // Check correctness of index
        if (index !== -1) {
            const selectedItems = this.getSelectedItems();
            if (index < 0 || index >= selectedItems.length) {
                return;
            }
        }

        this.store.dispatch(actions.activateSelectionItem(index));

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
        this.store.dispatch(actions.showAllItems(resetInput));
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

        this.store.dispatch(actions.filter(inputString));
    }

    /**
     * Fix multiple select issues on iOS safari
     * @param {Element} elem - select element
     */
    fixIOS(elem) {
        if (!elem || elem.tagName !== 'SELECT' || !this.state.multiple) {
            return;
        }

        const firstElement = elem.firstElementChild;
        if (
            firstElement?.tagName === 'OPTGROUP'
            && firstElement.hidden
            && firstElement.disabled
        ) {
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
    parseOption(option, group = null, state) {
        if (!option) {
            return null;
        }

        const item = {
            id: option.value,
            index: option.index,
            title: option.textContent,
            group,
            selected: option.selected,
            disabled: option.disabled,
        };

        return this.createItem(item, state);
    }

    /** Parse select element and create list items from child options */
    parseSelect(elem, state) {
        if (elem?.tagName !== 'SELECT' || !elem.options) {
            return state;
        }

        const res = state;
        res.items = [];
        if (elem.multiple) {
            res.multiple = true;
        }

        for (let i = 0, l = elem.children.length; i < l; i += 1) {
            const childElem = elem.children[i];
            if (childElem.tagName === 'OPTGROUP') {
                const group = this.createGroup({ title: childElem.label }, res);
                if (!group) {
                    return state;
                }
                res.items.push(group);

                for (let ci = 0, cl = childElem.children.length; ci < cl; ci += 1) {
                    const groupChild = childElem.children[ci];
                    const item = this.parseOption(groupChild, group.id, res);
                    if (!item) {
                        return state;
                    }
                    group.items.push(item);
                }
            } else if (childElem.tagName === 'OPTION') {
                const item = this.parseOption(childElem, null, res);
                if (!item) {
                    return state;
                }
                res.items.push(item);
            }
        }

        if (res.multiple) {
            return res;
        }

        // For single select check only one item is selected
        res.items = mapItems(res.items, (item) => ({
            ...item,
            selected: item.index === elem.selectedIndex,
        }));

        return res;
    }

    /**
     * Create items from specified array
     * @param {Object|Object[]} items
     * @param {Object} state
     */
    createItems(items, state = this.state) {
        return createItems(items, state);
    }

    /**
     * Append new item(s) to the end of list
     * @param {Object|Object[]} items
     */
    append(items) {
        this.store.dispatch(actions.append(items));
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
     */
    addItem(props) {
        this.store.dispatch(actions.addItem(props));
    }

    /** Returns new item object */
    createItem(props = {}, state = this.state) {
        return createItem(props, state);
    }

    /**
     * Creates new group item
     * @param {Object} options
     */
    addGroup(options) {
        this.store.dispatch(actions.addGroup(options));
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

    generateGroupId(items = this.state.items) {
        while (true) {
            const id = `group${Date.now()}${Math.random() * 10000}`;
            const found = getItemById(id, items);
            if (!found) {
                return id;
            }
        }
    }

    /**
     * Returns new group item object
     * @param {Object} options
     * @param {Object} state
     */
    createGroup(options = {}, state = this.state) {
        return createGroup(options, state);
    }

    getGroupById(id) {
        return getGroupById(id, this.state.items);
    }

    /** Remove item by id */
    removeItem(itemId) {
        const strId = itemId?.toString() ?? null;
        if (strId === null) {
            return;
        }

        this.store.dispatch(actions.removeItem(strId));
    }

    /** Remove all items */
    removeAll() {
        this.removeCreatableMenuItem();
        this.store.dispatch(actions.removeAllItems());
    }

    /** Set active state for specified list item */
    setActive(itemId) {
        if (this.state.ignoreScroll) {
            return;
        }

        const itemToActivate = this.getItem(itemId);
        const activeItem = this.getActiveItem();
        if (
            (activeItem && itemToActivate && activeItem.id === itemToActivate.id)
            || (!activeItem && !itemToActivate)
        ) {
            return;
        }

        const strId = itemToActivate?.id?.toString() ?? null;
        this.store.dispatch(actions.setActive(strId));
    }

    /** Enable/disable list item by id */
    enableItem(itemId, val) {
        const strId = itemId?.toString();
        const actionItem = this.getItem(strId);
        const toDisable = !val;
        if (!actionItem || actionItem.disabled === toDisable) {
            return;
        }

        this.store.dispatch(actions.toggleEnableItem(strId));
    }

    getGroupItems(group, state = this.state) {
        return getGroupItems(group, state);
    }

    renderSelect(state, prevState) {
        if (!this.props.useNativeSelect) {
            this.selectElem.textContent = '';
            return;
        }

        if (
            state.items === prevState?.items
            && state.multiple === prevState?.multiple
        ) {
            return;
        }

        this.selectElem.multiple = !!state.multiple;

        const options = [];

        state.items.forEach((item) => {
            if (item.type === 'group') {
                const group = this.createOptGroup(item.title, item.disabled);
                const children = item.items.map((i) => this.createOption(i));
                group.append(...children);
                options.push(group);
            } else {
                const option = this.createOption(item);
                options.push(option);
            }
        });

        this.selectElem.textContent = '';
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
            && state.disabled === prevState.disabled
            && state.visible === prevState.visible
            && state.filtered === prevState.filtered
            && state.renderTime === prevState.renderTime
        ) {
            return;
        }

        const items = (state.visible)
            ? filterItems(state.items, (item) => (
                !item.hidden && (!state.filtered || item.matchFilter)
            ))
            : [];
        const menuShown = state.visible !== prevState.visible && state.visible;

        this.menu.setState((menuState) => ({
            ...menuState,
            items,
            renderTime: state.renderTime,
            listScroll: (menuShown) ? 0 : menuState.listScroll,
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
            update: true,
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

    onScrollDone() {
        setTimeout(() => this.stopScrollIgnore(), IGNORE_SCROLL_TIMEOUT);
        this.listenWindowEvents();
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

        if (state.visible === prevState.visible) {
            if (state.items !== prevState.items) {
                this.updateListPosition();
            }

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
            return;
        }

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
            onScrollDone: () => this.onScrollDone(),
        });
    }

    renderValue(state, prevState) {
        if (state.items === prevState?.items) {
            return;
        }

        const selected = getSelectedItems(state);
        this.elem.dataset.value = selected.map((item) => item.id).join();
    }

    render(state, prevState = {}) {
        this.renderInProgress = true;

        this.elem.classList.toggle(MULTIPLE_CLASS, !!state.multiple);
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
        this.renderValue(state, prevState);

        if (this.combo) {
            this.combo.setState((comboState) => ({
                ...comboState,
                editable,
                disabled: state.disabled,
                items: toFlatList(state.items),
                actSelItemIndex: state.actSelItemIndex,
                inputString: state.inputString,
            }));
        }

        this.renderList(state, prevState);

        this.renderInProgress = false;
    }
}
