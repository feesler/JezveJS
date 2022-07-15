import { isFunction } from '../../js/index.js';
import { SortableDragAvatar } from './SortableDragAvatar.js';
import { SortableTableDragAvatar } from './SortableTableDragAvatar.js';
import { DragZone } from '../DragnDrop/DragZone.js';

// Sortable drag zone
export class SortableDragZone extends DragZone {
    constructor(...args) {
        super(...args);

        this.sortTarget = null;
    }

    makeAvatar() {
        if (this.params.table) {
            return new SortableTableDragAvatar(this, this.elem);
        }

        return new SortableDragAvatar(this, this.elem);
    }

    // Drag start handler
    // Return avatar object or false
    onDragStart(...args) {
        const avatar = super.onDragStart(...args);
        if (!avatar) {
            return false;
        }

        if (this.params && isFunction(this.params.ondragstart)) {
            this.params.ondragstart(avatar.dragZoneElem);
        }

        return avatar;
    }

    // Find specific drag zone element
    findDragZoneItem(target) {
        if (!this.params || !this.params.selector) {
            return null;
        }

        let el = target;
        while (el && el !== this.elem) {
            if (isFunction(el.matches) && el.matches(this.params.selector)) {
                if (el.classList.contains(this.params.placeholderClass)) {
                    return null;
                }

                return el;
            }
            el = el.parentNode;
        }

        return null;
    }

    // Check specified targer element is valid
    isValidDragHandle(target) {
        if (!target) {
            return false;
        }

        const item = this.findDragZoneItem(target);
        if (!item) {
            return false;
        }

        // allow to drag using whole drag zone in case no handles is set
        if (!this.params || !this.params.onlyRootHandle) {
            return super.isValidDragHandle(target);
        }

        return this.params.onlyRootHandle && target === item;
    }

    // Return group of sortable
    getGroup() {
        if (this.params && this.params.group) {
            return this.params.group;
        }

        return null;
    }

    // Return class for placeholder element
    getPlaceholder() {
        if (this.params && this.params.placeholderClass) {
            return this.params.placeholderClass;
        }

        return null;
    }

    // Return class for item element
    getItemSelector() {
        if (this.params && this.params.selector) {
            return this.params.selector;
        }

        return null;
    }

    // Return class for drag avatar element
    getDragClass() {
        if (this.params && this.params.dragClass) {
            return (this.params.dragClass === true) ? 'drag' : this.params.dragClass;
        }

        return null;
    }

    // Insert event handler
    onInsertAt(srcElem, elem) {
        if (this.params && isFunction(this.params.oninsertat)) {
            this.params.oninsertat(srcElem, elem);
        }
    }
}
