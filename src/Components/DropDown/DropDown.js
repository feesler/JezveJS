import {
    isFunction,
    ge,
    ce,
    svg,
    addChilds,
    removeChilds,
    re,
    px,
    insertAfter,
    selectByValue,
    prependChild,
    show,
    setEmptyClick,
    getOffset,
    isVisible,
    getCursorPos,
    setEvents,
    removeEvents,
} from '../../js/common.js';
import '../../css/common.css';
import './dropdown.css';

const CHECK_ICON = 'M1.08 4.93a.28.28 0 000 .4l2.35 2.34c.1.11.29.11.4 0l4.59-4.59a.28.28 0 000-.4l-.6-.6a.28.28 0 00-.4 0l-3.8 3.8-1.54-1.55a.28.28 0 00-.4 0z';

/**
 * Drop Down List constructor
 * @param {Object} params
 * @param {string|Element} params.input_id - identifier or element to attach DropDown comonent to
 * @param {boolean} params.editable - if set true user will be able to type text in the combo box
 * @param {boolean} params.disabled - if set true any interactions with component will be disabled
 * @param {boolean} params.useNativeSelect - if set true component will use native select element on
 *     small devices(less 768px width) to view list and edit selection
 * @param {boolean} params.fullScreen - if set true component will show fullscreen popup
 * @param {string} params.placeholder - placeholder text for component
 * @param {number} params.maxHeight - maximum count of items to show in drop down list
 * @param {Function} params.onitemselect - item selected event handler
 * @param {Function} params.onchange - selection changed event handler
 * @param {boolean|Function} params.oninput - text input event handler
 *    If set to true list items will be filtered by input value
 * @param {Function} params.renderItem - callback for custom selected item render
 * @param {string} params.extraClass - additional CSS classes
 * @param {Object} params.data - array of item objects { id, title }
 */
export class DropDown {
    constructor(params) {
        this.changed = false;
        this.visible = false;
        this.filtered = false;
        this.filteredCount = 0;
        this.manFilter = false;
        this.actItem = null;
        this.actSelItem = null;
        this.blockScroll = false;
        this.focusedElem = null;

        if (!params) {
            throw new Error('Inval id parameters');
        }
        if (!params.input_id) {
            throw new Error('input_id not specified');
        }

        this.createParams = params;
        this.multi = params.multi || false;
        this.listAttach = params.listAttach || false;
        this.editable = ('editable' in params) ? !!params.editable : true;
        this.disabled = ('disabled' in params) ? !!params.disabled : false;
        if (this.disabled) {
            this.editable = false;
        }

        this.useNativeSelect = ('useNativeSelect' in params) ? !!params.useNativeSelect : false;
        this.fullScreen = ('fullScreen' in params) ? !!params.fullScreen : false;

        this.setMaxHeight(params);

        this.placeholder = params.placeholder || null;

        this.itemSelectCallback = params.onitemselect || null;
        this.changeCallback = params.onchange || null;

        this.setInputCallback(params.oninput);

        if ('renderItem' in params) {
            if (!isFunction(params.renderItem)) {
                throw new Error('Invalid renderItem handler specified');
            }
            this.renderItem = params.renderItem;
        }

        this.toggleHandler = this.toggleList.bind(this);
        this.inputHandler = this.onInput.bind(this);
        this.hoverHandler = this.onMouseOver.bind(this);
        this.scrollHandler = this.onScroll.bind(this);
        this.selectChangeHandler = this.onChange.bind(this);
        this.listItemClickHandler = this.onListItemClick.bind(this);
        this.delSelectItemHandler = this.onDeleteSelectedItem.bind(this);
        this.inpHandlers = {
            focus: this.onFocus.bind(this),
            blur: this.onBlur.bind(this),
            keydown: this.onKey.bind(this),
        };

        const inpObj = (typeof params.input_id === 'string') ? ge(params.input_id) : params.input_id;
        if (!inpObj || !inpObj.parentNode) {
            throw new Error('Invalid element specified');
        }

        if (this.listAttach) {
            this.attachToElement(inpObj);
        } else {
            this.attachToInput(inpObj);
        }

        if (!this.disabled) {
            this.assignInputHandlers(this.containerElem);
        }

        this.selectElem.tabIndex = -1;

        if (params.extraClass) {
            this.containerElem.classList.add(params.extraClass);
        }

        if (this.useNativeSelect) {
            this.containerElem.classList.add('dd__container_native');
        }
        if (this.fullScreen) {
            this.containerElem.classList.add('dd__fullscreen');

            this.backgroundElem = ce('div', { className: 'dd__background' });
            this.containerElem.appendChild(this.backgroundElem);
        }

        this.fixIOS(this.selectElem);

        this.listElem = ce('ul');
        this.list = ce(
            'div',
            { className: 'dd__list' },
            this.listElem,
            { scroll: this.scrollHandler },
        );

        this.containerElem.appendChild(this.list);

        this.selectElem.addEventListener('change', this.selectChangeHandler);
        this.assignInputHandlers(this.selectElem);

        if (this.disabled) {
            this.selectElem.disabled = true;
        }

        if (!this.listAttach) {
            this.comboElem = this.createCombo();
            if (!this.comboElem) {
                throw new Error('Fail to create combo element');
            }
            this.containerElem.appendChild(this.comboElem);
        }

        this.makeEditable(this.editable);
        this.setTabIndexes();

        this.groups = [];
        this.items = [];
        if (inpObj.tagName === 'SELECT') {
            this.parseSelect(this.selectElem);
        }

        if (params.data) {
            this.append(params.data);
        }
    }

    /** Set maximum height of list element as count of items to be visible */
    setMaxHeight(params) {
        this.maxHeight = 5;
        if (!('maxHeight' in params)) {
            return;
        }

        this.maxHeight = parseInt(params.maxHeight, 10);
        if (Number.isNaN(this.maxHeight) || this.maxHeight <= 0) {
            throw new Error('Invalid maxHeight parameter');
        }
    }

    /** Attach DropDown component to specified input element */
    attachToInput(elem) {
        if (!this.isInputElement(elem)) {
            throw new Error('Invalid element specified');
        }

        // Create container
        this.containerElem = ce('div', { className: 'dd__container' });
        if (this.disabled) {
            this.containerElem.classList.add('dd__container_disabled');
        } else {
            this.containerElem.classList.add('dd__container_enabled');
        }

        this.selectionElem = ce('div', { className: 'dd__selection' });

        if (elem.tagName === 'SELECT') {
            this.selectElem = elem;
            if (elem.multiple) {
                this.multi = true;
            }

            if (elem.disabled) {
                this.disabled = true;
                this.editable = false;
            }

            insertAfter(this.containerElem, elem);
            this.inputElem = ce('input', { type: 'text' });
        } else {
            insertAfter(this.containerElem, elem);
            this.inputElem = re(elem);

            this.selectElem = ce('select');
            if (this.multi) {
                this.selectElem.multiple = true;
            }
        }
    }

    /** Attach DropDown to specified element */
    attachToElement(elem) {
        this.containerElem = ce(
            'div',
            { className: 'dd__container_attached' },
        );

        insertAfter(this.containerElem, elem);
        this.containerElem.style.width = px(elem.offsetWidth);
        this.containerElem.style.height = px(elem.offsetHeight);

        const hostElement = re(elem);
        if (!hostElement) {
            return false;
        }
        this.containerElem.appendChild(hostElement);

        hostElement.addEventListener('click', this.toggleHandler);
        if (!this.isInputElement(elem)) {
            this.editable = false;
        }

        if (!this.disabled && this.staticElem) {
            this.staticElem.addEventListener('click', this.toggleHandler);
        }

        this.selectElem = ce('select');
        if (this.multi) {
            this.selectElem.multiple = true;
        }

        this.containerElem.appendChild(hostElement);
        this.containerElem.appendChild(this.selectElem);

        return true;
    }

    /**
     * Set callback for oninput event
     * @param {boolean|Function} cb
     *   if set as true: set default filter callback
     *   if set as function: set specified function as callback
     */
    setInputCallback(cb) {
        this.inputCallback = null;
        if (!cb) {
            this.inputCallback = null;
        } else if (cb === true) {
            this.inputCallback = this.defaultInputHandler;
        } else if (isFunction(cb)) {
            this.inputCallback = cb;
        } else {
            throw new Error('Invalid oninput handler specified');
        }
    }

    /** Create combo element and return if success */
    createCombo() {
        if (this.listAttach || !this.inputElem) {
            return null;
        }

        // Create single selection element
        this.staticElem = ce('span', { className: 'dd__single-selection' });
        show(this.staticElem, !this.editable);

        this.toggleBtn = this.createToggleButton();

        const res = ce('div', { className: 'dd__combo' });
        if (this.multi) {
            addChilds(res, this.selectionElem);
        }
        addChilds(res, [
            this.staticElem,
            this.inputElem,
            this.selectElem,
            this.toggleBtn,
        ]);

        return res;
    }

    /** Create toggle drop down button */
    createToggleButton() {
        const arrowIcon = svg(
            'svg',
            { width: 24, height: 32 },
            svg('path', { d: 'm5.5 12 6.5 6 6.5-6z' }),
        );
        const res = ce(
            'div',
            { className: 'dd__toggle-btn' },
            arrowIcon,
            { click: this.toggleHandler },
        );

        if (this.disabled) {
            res.disabled = true;
        }

        return res;
    }

    /* Event handlers */
    /** List item 'click' event handler */
    onListItemClick(e) {
        const item = this.getItemByElem(e.target);
        if (!item || item.disabled) {
            return;
        }

        this.toggleItem(item.id);

        this.sendItemSelectEvent();
        this.changed = true;

        if (!this.multi) {
            this.show(false);
        }
    }

    /** Handler of 'change' event of native select */
    onChange() {
        if (!this.selectElem
            || !this.selectElem.options) {
            return;
        }

        this.items.forEach((item) => {
            const listItem = item;

            if (!listItem.optionElem) {
                return;
            }

            listItem.selected = listItem.optionElem.selected;
        });

        this.renderSelection();
        this.sendItemSelectEvent();

        this.changed = true;
    }

    /** 'focus' event handler */
    onFocus(e) {
        if (this.disabled) {
            return;
        }

        this.activate(true);

        if (this.isSelectedItemElement(e.target)) {
            e.target.classList.add('dd__selection-item_active');
        } else if (e.target === this.inputElem) {
            this.activateSelectedItem(null);
        } else if (e.target === this.containerElem) {
            if (e.relatedTarget === this.inputElem) {
                return;
            }

            if (this.editable && this.inputElem) {
                this.inputElem.focus();
            }
        }

        this.focusedElem = e.target;
    }

    /** 'blur' event handler */
    onBlur(e) {
        if (!this.isChildTarget(e.relatedTarget)) {
            this.activate(false);
        }

        if (e.target === this.selectElem) {
            this.sendChangeEvent();
        } else if (this.isSelectedItemElement(e.target)) {
            e.target.classList.remove('dd__selection-item_active');
        }

        this.focusedElem = null;
    }

    /** Click by delete button of selected item event handler */
    onDeleteSelectedItem(e) {
        if (!e || !e.target || !this.multi) {
            return false;
        }

        if (e.type === 'keydown' && (
            !this.isSelectedItemElement(e.target)
            || !e.target.classList.contains('dd__selection-item_active')
        )) {
            return true;
        }

        if (e.type === 'click'
            && !e.target.classList.contains('dd__del-selection-item-btn')) {
            return true;
        }

        const selectedItems = this.getSelectedItems();
        if (!selectedItems.length) {
            return true;
        }

        const index = this.getSelectedItemIndex(e.target);
        if (index === -1) {
            return true;
        }

        // Focus host input if deselect last(right) selected item
        // Activate next selected item otherwise
        if (index === selectedItems.length - 1) {
            this.activateSelectedItem(null);
            setTimeout(this.inputElem.focus.bind(this.inputElem));
        } else {
            this.activateSelectedItem(selectedItems[index + 1]);
        }

        const item = selectedItems[index];
        if (item) {
            this.deselectItem(item.id);
        }

        this.sendItemSelectEvent();
        this.changed = true;
        this.sendChangeEvent();

        return true;
    }

    /** 'scroll' event of list element handler */
    onScroll() {
        if (!this.blockScroll) {
            this.setActive(null);
        }

        this.blockScroll = false;
    }

    /** 'keydown' event handler */
    onKey(e) {
        let newItem = null;

        e.stopPropagation();

        if (
            (this.editable && e.target === this.inputElem)
            || (!this.editable && e.target === this.containerElem)
        ) {
            if (
                this.multi
                && (
                    e.code === 'Backspace'
                    || e.key === 'Backspace'
                    || e.code === 'ArrowLeft'
                    || e.key === 'Left'
                )
            ) {
                if (this.editable && e.currentTarget === this.inputElem) {
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
            if (this.multi && this.isSelectedItemElement(e.target)) {
                const selectedItems = this.getSelectedItems();
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
                        this.activateSelectedItem(selectedItems[1]);
                    } else {
                        this.activateSelectedItem(null);
                        setTimeout(this.inputElem.focus.bind(this.inputElem));
                    }
                } else {
                    // Activate previous selected item
                    this.activateSelectedItem(selectedItems[index - 1]);
                }

                const item = selectedItems[index];
                if (item) {
                    this.deselectItem(item.id);
                }
            }

            return;
        }

        if (this.multi && (e.code === 'Delete' || e.key === 'Del')) {
            this.onDeleteSelectedItem(e);
            return;
        }

        if (this.multi && (e.code === 'ArrowLeft' || e.key === 'Left')) {
            if (this.isSelectedItemElement(e.target)) {
                const selectedItems = this.getSelectedItems();
                if (!selectedItems.length) {
                    return;
                }

                const index = this.getSelectedItemIndex(e.target);
                if (index === 0) {
                    return;
                }

                this.activateSelectedItem(selectedItems[index - 1]);
            }

            return;
        }

        if (this.multi && (e.code === 'ArrowRight' || e.key === 'Right')) {
            if (this.isSelectedItemElement(e.target)) {
                const selectedItems = this.getSelectedItems();
                if (!selectedItems.length) {
                    return;
                }

                const index = this.getSelectedItemIndex(e.target);
                if (index === -1) {
                    return;
                }

                if (index === selectedItems.length - 1) {
                    this.activateSelectedItem(null);
                    setTimeout(this.inputElem.focus.bind(this.inputElem));
                } else {
                    this.activateSelectedItem(selectedItems[index + 1]);
                }
            }

            return;
        }

        if (e.code === 'ArrowDown' || e.key === 'Down') {
            const availItems = this.getAvailableItems();

            if (!this.visible && !this.actItem) {
                this.show(true);
                [newItem] = availItems;
            } else if (this.visible) {
                if (this.actItem) {
                    newItem = this.getNextAvailableItem(this.actItem.id);
                } else {
                    [newItem] = availItems;
                }
            }
        } else if (e.code === 'ArrowUp' || e.key === 'Up') {
            if (this.visible && this.actItem) {
                newItem = this.getPrevAvailableItem(this.actItem.id);
            }
        } else if (e.code === 'Home' || e.key === 'Home') {
            const availItems = this.getAvailableItems();
            if (availItems.length > 0) {
                [newItem] = availItems;
            }
        } else if (e.code === 'End' || e.key === 'End') {
            const availItems = this.getAvailableItems();
            if (availItems.length > 0) {
                newItem = availItems[availItems.length - 1];
            }
        } else if (e.code === 'Enter' || e.key === 'Enter') {
            if (this.actItem) {
                this.toggleItem(this.actItem.id);
                this.sendItemSelectEvent();
                this.changed = true;

                if (!this.multi) {
                    this.show(false);
                }
            }

            e.preventDefault();
        } else if (e.code === 'Escape') {
            this.show(false);
            if (this.focusedElem) {
                this.focusedElem.blur();
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

    /** Handler for 'mouseover' event on list item */
    onMouseOver(e) {
        if (this.blockScroll) {
            return;
        }

        const item = this.getItemByElem(e.target);
        if (!item) {
            return;
        }

        this.setActive(item);
    }

    /** Handler for 'input' event of text field  */
    onInput() {
        if (isFunction(this.inputCallback)) {
            return this.inputCallback.call(this);
        }

        return true;
    }

    /* List items methods */
    /** Return list item object by id */
    getItem(itemId) {
        return this.items.find((item) => item.id === itemId);
    }

    /** Return index of list item by id */
    getItemIndex(itemId) {
        return this.items.findIndex((item) => item.id === itemId);
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
            return this.items[ind - 1];
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

        if (ind < this.items.length) {
            return this.items[ind + 1];
        }

        return null;
    }

    /** Return array of all list items */
    getItems() {
        return this.items;
    }

    /** Return array of visible(not hidden) list items */
    getVisibleItems() {
        return this.items.filter((item) => !item.hidden);
    }

    /** Return array of visible and enabled list items */
    getAvailableItems() {
        return this.items.filter((item) => (!item.hidden && !item.disabled));
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
    getSelectedItems() {
        return this.items.filter((item) => item && item.selected);
    }

    /** Return list item object which list element contains specified element */
    getItemByElem(elem) {
        if (!elem) {
            return null;
        }

        return this.items.find((item) => item && item.elem.contains(elem));
    }

    /** Return count of items to show at drop down list */
    getListHeight() {
        return Math.min(
            this.maxHeight,
            (this.filtered) ? this.filteredCount : this.items.length,
        );
    }

    /** Show or hide drop down list */
    show(val) {
        if (isVisible(this.selectElem)) {
            return;
        }

        if (!this.list) {
            return;
        }

        this.visible = val;

        if (val) {
            if (!this.editable && this.toggleBtn) {
                this.toggleBtn.focus();
            }
            this.activate(true);

            const html = document.documentElement;
            const { scrollHeight } = html;
            const screenBottom = html.scrollTop + html.clientHeight;

            this.containerElem.classList.add('dd__open');

            let listHeight = 0;
            const visibleItems = this.getVisibleItems();
            if (visibleItems.length > 0) {
                const itemHeight = parseInt(visibleItems[0].elem.offsetHeight, 10);
                const itemsToShow = this.getListHeight();
                listHeight = itemsToShow * itemHeight;
            }

            let border = 0;
            if (!this.listAttach) {
                border = (this.comboElem.offsetHeight - this.comboElem.scrollHeight) / 2;
            }

            this.list.style.height = px(0);

            const offset = getOffset(this.list.offsetParent);
            const container = getOffset(this.containerElem);
            container.width = this.containerElem.offsetWidth;
            container.height = this.containerElem.offsetHeight;
            const totalListHeight = container.height + listHeight;
            const listBottom = container.top + totalListHeight;

            if (this.fullScreen && isVisible(this.backgroundElem)) {
                document.body.style.overflow = 'hidden';
                this.list.classList.add('dd__list_drop-down');

                const fullScreenListHeight = html.clientHeight - this.comboElem.offsetHeight;
                this.list.style.height = px(fullScreenListHeight / 2);
            } else {
                // Check vertical offset of drop down list
                if (listBottom > scrollHeight) {
                    this.list.classList.add('dd__list_drop-up');
                    this.list.style.top = px(container.top - offset.top - listHeight + border);
                } else {
                    this.list.classList.add('dd__list_drop-down');
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
            this.list.style.minWidth = px(container.width);

            const listWidth = this.list.offsetWidth;
            const leftOffset = container.left - html.scrollLeft + container.width;
            if (leftOffset + listWidth > html.clientWidth) {
                this.list.style.left = px(
                    container.left + container.width - listWidth - offset.left,
                );
            } else {
                this.list.style.left = px(container.left - offset.left);
            }

            setEmptyClick(
                this.show.bind(this, false),
                [this.inputElem, this.staticElem, this.list, this.toggleBtn],
            );

            if (this.editable) {
                this.inputElem.focus();
            }
            this.list.scrollTop = 0;
        } else {
            this.containerElem.classList.remove('dd__open');
            if (this.fullScreen) {
                document.body.style.overflow = '';
            }

            this.list.classList.remove('dd__list_drop-down');
            this.list.classList.remove('dd__list_drop-up');

            setEmptyClick();
            this.sendChangeEvent();
            this.setActive(null);
        }
    }

    /** Enable/disable text input at combo element  */
    makeEditable(val) {
        if (this.listAttach) {
            return false;
        }

        const editable = (typeof val !== 'undefined') ? val : true;
        if (editable && this.disabled) {
            return true;
        }

        this.editable = val;

        if (this.placeholder) {
            this.inputElem.placeholder = this.placeholder;
        }

        show(this.staticElem, !this.editable);
        show(this.inputElem, this.editable);

        if (this.editable) {
            this.containerElem.classList.add('dd__editable');
            this.inputElem.addEventListener('input', this.inputHandler);
            this.inputElem.classList.add('dd__input');
            this.inputElem.value = this.staticElem.textContent;
            this.assignInputHandlers(this.inputElem);
            this.inputElem.autocomplete = 'off';
        } else {
            this.containerElem.classList.remove('dd__editable');
            this.removeInputHandlers(this.inputElem);
            this.inputElem.removeEventListener('input', this.inputHandler);
            this.inputElem.classList.remove('dd__input');

            this.staticElem.textContent = (this.placeholder && this.inputElem.value.length === 0)
                ? this.placeholder
                : this.inputElem.value;
            if (!this.disabled) {
                this.staticElem.addEventListener('click', this.toggleHandler);
            }
        }

        this.setTabIndexes();

        return true;
    }

    /** Setup tabindexes of component */
    setTabIndexes() {
        if (this.disabled) {
            this.containerElem.removeAttribute('tabindex');
            if (this.inputElem) {
                this.inputElem.removeAttribute('tabindex');
            }
            this.selectElem.removeAttribute('tabindex');
        } else if (isVisible(this.selectElem)) {
            this.selectElem.setAttribute('tabindex', 0);
            this.containerElem.setAttribute('tabindex', -1);
            if (this.inputElem) {
                this.inputElem.setAttribute('tabindex', (this.editable) ? 0 : -1);
            }
        } else {
            this.selectElem.setAttribute('tabindex', -1);
            this.containerElem.setAttribute('tabindex', (this.editable) ? -1 : 0);
            if (this.inputElem) {
                this.inputElem.setAttribute('tabindex', (this.editable) ? 0 : -1);
            }
        }
    }

    /** Enable or disable component */
    enable(val) {
        const toEnable = (typeof val !== 'undefined') ? val : true;
        if (toEnable !== this.disabled) {
            return;
        }

        this.disabled = !toEnable;

        if (this.disabled) {
            this.containerElem.classList.add('dd__container_disabled');
            this.containerElem.classList.remove('dd__container_enabled');
            this.removeInputHandlers(this.containerElem);
        } else {
            this.containerElem.classList.remove('dd__container_disabled');
            this.containerElem.classList.add('dd__container_enabled');
            this.assignInputHandlers(this.containerElem);
        }

        this.setTabIndexes();

        this.inputElem.disabled = this.disabled;
        this.selectElem.disabled = this.disabled;
        this.toggleBtn.disabled = this.disabled;
    }

    /** Show drop down list if hidden or hide if visible */
    toggleList() {
        if (!this.list || !this.listElem || this.disabled) {
            return;
        }

        if (!this.visible && this.filtered && !this.manFilter) {
            this.items.forEach(function (item) {
                const listItem = item;

                listItem.hidden = false;
                show(listItem.elem, true);
                this.showOption(listItem.optionElem, true);
            }, this);

            this.filtered = false;
        }

        this.show(!this.visible);
    }

    /** Activate or deactivate component */
    activate(val) {
        if (val) {
            this.containerElem.classList.add('dd__container_active');
        } else {
            this.containerElem.classList.remove('dd__container_active');
            this.show(false);
        }
    }

    /** Check specified element is child of some selected item element */
    isSelectedItemElement(elem) {
        return elem
            && Array.isArray(this.selectedElems)
            && this.selectedElems.find((selem) => selem.contains(elem));
    }

    /** Check specified element is child of component */
    isChildTarget(elem) {
        return elem && this.containerElem.contains(elem);
    }

    /** Return selected item element for specified item object */
    renderSelectedItem(item) {
        const deselectButton = ce(
            'span',
            { className: 'dd__del-selection-item-btn', innerHTML: '&times;' },
            null,
            { click: this.delSelectItemHandler },
        );

        return ce(
            'span',
            { className: 'dd__selection-item', textContent: item.title },
            deselectButton,
        );
    }

    /** Render selection elements */
    renderSelection() {
        const selectedItems = this.getSelectedItems();

        if (!this.multi) {
            if (selectedItems.length) {
                this.setText(selectedItems[0].title);
            } else {
                this.setText('');
            }

            return;
        }

        const renderCallback = isFunction(this.renderItem)
            ? this.renderItem
            : this.renderSelectedItem;
        this.selectedElems = selectedItems.map((item) => {
            const listItem = item;
            const elem = renderCallback.call(this, listItem);
            if (!elem) {
                return null;
            }

            elem.tabIndex = -1;
            elem.dataset.id = listItem.id;
            this.assignInputHandlers(elem);

            listItem.selectedElem = elem;

            return elem;
        }, this);

        removeChilds(this.selectionElem);
        addChilds(this.selectionElem, this.selectedElems);

        if (this.actSelItem && !this.disabled) {
            this.actSelItem.selectedElem.focus();
        }
    }

    /** Deselect all items */
    clearSelection() {
        this.items.forEach((item) => {
            const listItem = item;

            listItem.selected = false;
        });
    }

    /** Return selected items data for 'itemselect' and 'change' events */
    getSelectionData() {
        const selectedItems = this.getSelectedItems()
            .map((item) => ({ id: item.id, value: item.title }));

        if (this.multi) {
            return selectedItems;
        }

        return (selectedItems.length > 0) ? selectedItems[0] : null;
    }

    /** Send current selection data to 'itemselect' event handler */
    sendItemSelectEvent() {
        if (isFunction(this.itemSelectCallback)) {
            const data = this.getSelectionData();
            this.itemSelectCallback.call(this, data);
        }
    }

    /**
     * Send current selection data to 'change' event handler
     * 'change' event occurs after user finnished selection of item(s) and list was hidden
     */
    sendChangeEvent() {
        if (!this.changed) {
            return;
        }

        if (isFunction(this.changeCallback)) {
            const data = this.getSelectionData();
            this.changeCallback.call(this, data);
        }

        this.changed = false;
    }

    /** Toggle item selected status */
    toggleItem(itemId) {
        const item = this.getItem(itemId);
        if (!item) {
            throw new Error(`Item ${itemId} not found`);
        }

        if (item.selected && this.multi) {
            return this.deselectItem(itemId);
        }

        return this.selectItem(itemId);
    }

    /** Select specified item */
    selectItem(itemId) {
        const item = this.getItem(itemId);
        if (item && item.selected) {
            return;
        }

        if (this.multi) {
            if (item) {
                this.check(item.id, true);
            }
        } else {
            this.clearSelection();
        }

        if (this.selectElem) {
            selectByValue(this.selectElem, (item) ? item.id : 0);
        }

        if (item) {
            item.selected = true;
        }

        this.renderSelection();
    }

    /** Deselect specified item */
    deselectItem(itemId) {
        const item = this.getItem(itemId);
        if (!item) {
            throw new Error(`Item ${itemId} not found`);
        }

        if (!item.selected) {
            return;
        }

        if (this.multi) {
            this.check(itemId, false);
            selectByValue(this.selectElem, itemId, false);
        } else {
            selectByValue(this.selectElem, 0);
        }

        item.selectedElem = null;
        item.selected = false;

        this.renderSelection();
    }

    /** Return index of selected item contains specified element */
    getSelectedItemIndex(elem) {
        const selectedItems = this.getSelectedItems();
        if (!Array.isArray(selectedItems)) {
            return -1;
        }

        return selectedItems.findIndex((item) => item.selectedElem.contains(elem));
    }

    /** Activate specified selected item */
    activateSelectedItem(item) {
        if (!item) {
            this.actSelItem = null;
            return;
        }

        if (this.disabled || !item.selected) {
            return;
        }

        this.actSelItem = item;
        this.actSelItem.selectedElem.focus();

        this.setActive(null);
    }

    /** Activate last(right) selected item */
    activateLastSelectedItem() {
        const selectedItems = this.getSelectedItems();
        if (!selectedItems.length) {
            return;
        }

        this.activateSelectedItem(selectedItems[selectedItems.length - 1]);
    }

    /** Filter input handler */
    defaultInputHandler() {
        if (!this.inputElem) {
            return false;
        }

        const found = this.filter(this.inputElem.value);
        this.show(found);

        return true;
    }

    /** Show/hide specified option element */
    showOption(option, val) {
        if (!option || !option.parentNode) {
            return;
        }

        const parent = option.parentNode;
        const toShow = (typeof val !== 'undefined') ? val : true;
        const visible = !parent.classList.contains('dd__opt-wrapper');
        if (visible === toShow) {
            return;
        }

        if (toShow) {
            insertAfter(option, parent);
            re(parent);
        } else {
            const wrapper = ce('div', { className: 'dd__opt-wrapper' });
            insertAfter(wrapper, option);
            wrapper.appendChild(option);
        }
    }

    /** Show only items containing specified string */
    filter(fstr) {
        let found = false;
        const lfstr = fstr.toLowerCase();

        this.filteredCount = 0;

        if (lfstr.length === 0) {
            this.items.forEach((item) => {
                const listItem = item;

                listItem.hidden = false;
                show(listItem.elem, true);
                this.showOption(listItem.optionElem, true);
            });

            this.filtered = false;
        } else {
            this.items.forEach((item) => {
                const listItem = item;
                const ival = item.title.toLowerCase();
                const match = ival.includes(lfstr, 0);
                if (match) {
                    this.filteredCount += 1;
                }

                listItem.hidden = !match;
                show(listItem.elem, match);
                this.showOption(listItem.optionElem, match);
                found = (found || match);

                if (found) {
                    this.filtered = true;
                }
            });
        }

        return found;
    }

    /**
     * Add or remove check mark for specified item
     * @param {number} itemId - identifier of item
     * @param {boolean} val - if set to true check mark will be added, and removed otherwise
     */
    check(itemId, val) {
        if (!this.multi) {
            return false;
        }

        const item = this.getItem(itemId);
        if (!item || !item.divElem) {
            return false;
        }

        if (val) {
            item.divElem.classList.add('dd__list-item_selected');
        } else {
            item.divElem.classList.remove('dd__list-item_selected');
        }

        return true;
    }

    /**
     * Fix multiple select issues on iOS safari
     * @param {Element} elem - select element
     */
    fixIOS(elem) {
        if (!elem || elem.tagName !== 'SELECT' || !this.multi) {
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
    parseOption(option, group) {
        if (!option) {
            return false;
        }

        const groupObj = (typeof group !== 'undefined') ? group : null;
        const itemId = option.value;
        const title = option.textContent;

        const item = this.addItem({
            id: itemId,
            title,
            group: groupObj,
            appendToSelect: false,
        });
        if (!item) {
            return false;
        }

        item.optionElem = option;
        if (option.selected) {
            item.selected = true;
            if (this.multi) {
                this.check(item.id, true);
            }
        }

        if (option.disabled) {
            this.enableItem(itemId, false);
        }

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
                const group = this.addGroup(childElem.label);
                if (!group) {
                    return false;
                }

                for (let ci = 0, cl = childElem.children.length; ci < cl; ci += 1) {
                    const groupChild = childElem.children[ci];
                    if (!this.parseOption(groupChild, group)) {
                        return false;
                    }
                }

                if (group.listElem.children.length > 0) {
                    this.listElem.appendChild(group.elem);
                }
            } else if (childElem.tagName === 'OPTION') {
                if (!this.parseOption(childElem, null)) {
                    return false;
                }
            }
        }

        this.renderSelection();

        return true;
    }

    /**
     * Append new item(s) to the end of list
     * @param {Object|Object[]} items
     */
    append(items) {
        if (!items || !this.list || !this.listElem) {
            return false;
        }

        const data = Array.isArray(items) ? items : [items];
        data.forEach((item) => {
            const props = {
                ...item,
                appendToSelect: true,
            };
            this.addItem(props);
        });

        return true;
    }

    /** Append option to specified target element */
    addOption(target, itemId, title, disabled) {
        const availTargets = ['SELECT', 'OPTGROUP'];

        if (!target || !availTargets.includes(target.tagName)) {
            return null;
        }

        const option = ce('option', { value: itemId, textContent: title });
        if (disabled) {
            option.setAttribute('disabled', '');
        }

        target.appendChild(option);

        return option;
    }

    /** Append option group to specified target element */
    addOptGroup(target, groupTitle, groupDisabled) {
        if (!target || target.tagName !== 'SELECT') {
            return null;
        }

        const disabled = (typeof groupDisabled !== 'undefined') ? groupDisabled : false;

        const optGroup = ce('optgroup', { label: groupTitle, disabled });
        target.appendChild(optGroup);

        return optGroup;
    }

    /**
     * Create new list item
     * @param {Object} props
     * @param {string} props.id - identifier of new list item
     * @param {string} props.title - title of list item
     * @param {string} props.group - optional target group identifier
     * @param {string} props.disabled - optional disabled item flag
     * @param {bool} props.appendToSelect - append new item to select element or not
     */
    addItem(props) {
        if (!props || !('id' in props) || !this.list || !this.listElem) {
            return null;
        }

        const item = {
            id: props.id,
            title: props.title,
            selected: false,
            hidden: false,
            disabled: props.disabled,
        };

        let appendToSelect = true;
        if ('appendToSelect' in props) {
            appendToSelect = !!props.appendToSelect;
        }

        if (appendToSelect && !this.multi && !this.items.length && item.id !== 0) {
            this.selectElem.appendChild(ce('option', { disabled: true, value: 0 }));
        }

        item.divElem = ce(
            'div',
            { className: 'dd__list-item' },
            null,
            { mouseover: this.hoverHandler },
        );
        if (this.multi) {
            item.checkIcon = svg(
                'svg',
                { width: 17, height: 17, viewBox: '0 1 10 10' },
                svg('path', { d: CHECK_ICON }),
            );
            item.divElem.appendChild(item.checkIcon);

            item.titleElem = ce('span', { title: item.title, textContent: item.title });
            item.divElem.appendChild(item.titleElem);
        } else {
            item.divElem.title = item.title;
            item.divElem.textContent = item.title;
        }

        item.elem = ce('li', {}, item.divElem, { click: this.listItemClickHandler });
        if (item.disabled) {
            item.elem.setAttribute('disabled', '');
        }

        if (props.group) {
            props.group.listElem.appendChild(item.elem);
            item.group = props.group;
        } else {
            this.listElem.appendChild(item.elem);
            item.group = null;
        }

        if (appendToSelect) {
            item.optionElem = this.addOption(this.selectElem, item.id, item.title, item.disabled);
            if (!this.multi) {
                item.selected = item.optionElem.selected;
            }
        }
        this.items.push(item);

        if (item.selected) {
            this.renderSelection();
        }

        return item;
    }

    /**
     * Create new group
     * @param {string} label
     * @param {boolean} appendToSelect - if true optgroup element will be appended to select element
     */
    addGroup(label, appendToSelect) {
        if (!this.list || !this.listElem) {
            return null;
        }

        const group = {
            title: label,
            disabled: false,
        };

        const toAppend = (typeof appendToSelect !== 'undefined') ? appendToSelect : true;

        group.labelElem = ce('label', { textContent: group.title });
        group.listElem = ce('ul');
        group.elem = ce(
            'div',
            { className: 'dd__list-group' },
            [
                group.labelElem,
                group.listElem,
            ],
        );

        if (toAppend) {
            group.optGroupElem = this.addOptGroup(this.selectElem, group.title);
        }

        this.groups.push(group);

        return group;
    }

    /** Remove elements of item */
    detachItem(item) {
        if (!item) {
            return;
        }

        this.deselectItem(item.id);
        re(item.optionElem);
        re(item.divElem);
    }

    /** Remove item by id */
    removeItem(itemId) {
        const itemIndex = this.getItemIndex(itemId);
        if (itemIndex === -1) {
            return;
        }

        const item = this.items[itemIndex];
        this.detachItem(item);

        this.items.splice(itemIndex, 1);
    }

    /** Remove all items */
    removeAll() {
        this.items.forEach(function (item) {
            this.detachItem(item);
        }, this);

        this.items = [];
    }

    /** Set active state for specified list item */
    setActive(item) {
        const listItem = item;

        if (this.actItem) {
            this.actItem.divElem.classList.remove('dd__list-item_active');
            this.actItem = null;
        }

        if (this.blockScroll) {
            return;
        }

        if (!listItem || !this.items.length) {
            return;
        }

        listItem.divElem.classList.add('dd__list-item_active');
        this.actItem = listItem;

        if (this.editable) {
            this.inputElem.focus();
        }
    }

    /** Enable/disable list item by id */
    enableItem(itemId, val) {
        const item = this.getItem(itemId);
        if (!item || item.disabled === !val) {
            return;
        }

        if (this.actItem === item) {
            this.actItem.divElem.classList.remove('dd__list-item_active');
            this.actItem = null;
        }

        item.disabled = !val;
        if (item.disabled) {
            this.deselectItem(item.id);

            item.elem.setAttribute('disabled', '');
            item.optionElem.setAttribute('disabled', '');
        } else {
            item.elem.removeAttribute('disabled');
            item.optionElem.removeAttribute('disabled');
        }
    }

    /** Scrol list element until specified list item be fully visible */
    scrollToItem(item) {
        if (
            !this.visible
            || !item /* drop down list must be visible */
            || item.hidden /* item must exist and be visible */
        ) {
            return;
        }

        const itemTop = item.elem.offsetTop;
        const itemBottom = itemTop + item.elem.offsetHeight;
        const listTop = this.list.scrollTop;
        const listHeight = this.list.clientHeight;
        const listBottom = listTop + listHeight;

        if (itemTop < listTop) {
            /* scroll up : decrease scroll top */
            this.blockScroll = true;
            this.list.scrollTop = Math.min(this.list.scrollHeight, itemTop);
        } else if (itemBottom > listBottom) {
            /* scroll down : increase scroll top */
            this.blockScroll = true;
            this.list.scrollTop = Math.min(
                this.list.scrollHeight,
                listTop + itemBottom - listBottom,
            );
        }

        setTimeout(() => {
            this.blockScroll = false;
        }, 200);
    }

    /** Check specified element is in input elements group */
    isInputElement(elem) {
        const inputTags = ['INPUT', 'SELECT', 'TEXTAREA'];

        return elem && inputTags.includes(elem.tagName);
    }

    /** Return current filtered flag */
    isFiltered() {
        return this.filtered;
    }

    /** Set text for single selection */
    setText(str) {
        if (typeof str !== 'string') {
            return;
        }

        if (str.length > 0) {
            if (this.editable && this.inputElem) {
                this.inputElem.value = str;
            } else if (!this.editable && this.staticElem) {
                this.staticElem.textContent = str;
                this.staticElem.title = str;
                this.staticElem.classList.remove('dd__single-selection_placeholder');
            }
        } else {
            this.staticElem.textContent = this.placeholder;
            this.staticElem.title = '';
            this.staticElem.classList.add('dd__single-selection_placeholder');
        }
    }

    /** Add focus/blur event handlers to specified element */
    assignInputHandlers(elem) {
        setEvents(elem, this.inpHandlers);
    }

    /** Remove focus/blur event handlers from specified element */
    removeInputHandlers(elem) {
        removeEvents(elem, this.inpHandlers);
    }

    /** Static alias for DropDown constructor */
    static create(params) {
        try {
            return new DropDown(params);
        } catch (e) {
            return null;
        }
    }
}
