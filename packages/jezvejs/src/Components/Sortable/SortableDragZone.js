import { isFunction } from '../../js/common.js';
import { SortableDragAvatar } from './SortableDragAvatar.js';
import { SortableTableDragAvatar } from './SortableTableDragAvatar.js';
import { DragZone } from '../DragnDrop/DragZone.js';

const defaultProps = {
    group: null,
    ondragstart: null,
    oninsertat: null,
    table: false,
    copyWidth: false,
    selector: null,
    placeholderClass: false,
    dragClass: 'drag',
    onlyRootHandle: false,
    allowSingleItemSort: false,
    handles: null,
};

/** Sortable drag zone */
export class SortableDragZone extends DragZone {
    constructor(...args) {
        super(...args);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.sortTarget = null;
    }

    makeAvatar() {
        const avatarProps = {
            dragZone: this,
            elem: this.elem,
        };

        if (this.props.table) {
            return SortableTableDragAvatar.create(avatarProps);
        }

        return SortableDragAvatar.create(avatarProps);
    }

    // Drag start handler
    // Return avatar object or false
    onDragStart(...args) {
        const avatar = super.onDragStart(...args);
        if (!avatar) {
            return false;
        }

        if (this.props && isFunction(this.props.ondragstart)) {
            this.props.ondragstart(avatar.dragZoneElem);
        }

        return avatar;
    }

    // Find specific drag zone element
    findDragZoneItem(target) {
        if (!this.props.selector) {
            return null;
        }

        let el = target;
        while (el && el !== this.elem) {
            if (isFunction(el.matches) && el.matches(this.props.selector)) {
                if (el.classList.contains(this.props.placeholderClass)) {
                    return null;
                }

                return el;
            }
            el = el.parentNode;
        }

        return null;
    }

    // Returns all drag items inside of container
    findAllDragZoneItems() {
        return Array.from(this.elem.querySelectorAll(this.props.selector));
    }

    // Check specified targer element is valid
    isValidDragHandle(target) {
        if (!target) {
            return false;
        }

        if (!this.props?.allowSingleItemSort) {
            const allItems = this.findAllDragZoneItems();
            if (allItems.length < 2) {
                return false;
            }
        }

        const item = this.findDragZoneItem(target);
        if (!item) {
            return false;
        }

        // allow to drag using whole drag zone in case no handles is set
        if (!this.props?.onlyRootHandle) {
            return super.isValidDragHandle(target);
        }

        return this.props.onlyRootHandle && target === item;
    }

    // Return group of sortable
    getGroup() {
        if (this.props && this.props.group) {
            return this.props.group;
        }

        return null;
    }

    // Return class for placeholder element
    getPlaceholder() {
        if (this.props && this.props.placeholderClass) {
            return this.props.placeholderClass;
        }

        return null;
    }

    // Return class for item element
    getItemSelector() {
        if (this.props && this.props.selector) {
            return this.props.selector;
        }

        return null;
    }

    // Return class for drag avatar element
    getDragClass() {
        if (this.props && this.props.dragClass) {
            return (this.props.dragClass === true) ? 'drag' : this.props.dragClass;
        }

        return null;
    }

    // Insert event handler
    onInsertAt(srcElem, elem) {
        if (this.props && isFunction(this.props.oninsertat)) {
            this.props.oninsertat(srcElem, elem);
        }
    }
}
