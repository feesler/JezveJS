import { isFunction } from '@jezvejs/types';
import { SortableDragAvatar } from './SortableDragAvatar.js';
import { SortableTableDragAvatar } from './SortableTableDragAvatar.js';
import { DragZone } from '../DragnDrop/DragZone.js';

const defaultProps = {
    group: null,
    onDragStart: null,
    onSort: null,
    table: false,
    copyWidth: false,
    selector: null,
    containerSelector: null,
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
    onDragStart(params) {
        const avatar = super.onDragStart(params);
        if (!avatar) {
            return false;
        }

        if (isFunction(this.props.onDragStart)) {
            this.props.onDragStart({ ...params, avatar });
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

    /** Returns sortable group */
    getGroup(elem) {
        const group = this.props?.group ?? null;
        return isFunction(group) ? group(elem ?? this.elem) : group;
    }

    /** Returns CSS class for placeholder element */
    getPlaceholder() {
        return this.props?.placeholderClass ?? null;
    }

    /** Returns selector for sortable item element */
    getItemSelector() {
        return this.props?.selector ?? null;
    }

    /** Returns selector for container element */
    getContainerSelector() {
        return this.props?.containerSelector ?? null;
    }

    // Return class for drag avatar element
    getDragClass() {
        if (this.props?.dragClass) {
            return (this.props.dragClass === true) ? 'drag' : this.props.dragClass;
        }

        return null;
    }

    /** Sort done event handler */
    onSortEnd(info) {
        if (isFunction(this.props.onSort)) {
            this.props.onSort(info);
        }
    }
}
