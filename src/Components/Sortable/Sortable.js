import { ge } from '../../js/common.js';
import { SortableDragZone } from './SortableDragZone.js';
import { SortableDropTarget } from './SortableDropTarget.js';

const dragZoneDefaults = {
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

const dropTargetDefaults = {
    group: null,
};

/**
 * Sortable widget constructor
 * @param {Object} props
 * @param {String} props.container - identifier or Element of sortable container
 * @param {String} props.group - sortable group udentifier
 * @param {Function} props.ondragstart - drag start event handler
 * @param {Function} props.oninsertat - drop item on new place event handler
 * @param {boolean} props.table - enable table sort behavior
 * @param {boolean} props.copyWidth - enable copying width of original item to drag avatar
 * @param {String} props.selector - CSS selector for sortable items
 * @param {String} props.placeholderClass - CSS class for placeholder item
 * @param {String} props.dragClass - CSS class for drag avatar
 * @param {boolean} props.onlyRootHandle - enable drag start only on root of item
 * @param {String|String[]} props.handles - CSS selectors for available drag start handles
 */
export class Sortable {
    static create(...args) {
        return new Sortable(...args);
    }

    constructor(props = {}) {
        const dragZoneParam = {};
        const dropTargetParam = {};

        Object.keys(dragZoneDefaults).forEach((key) => {
            dragZoneParam[key] = (key in props)
                ? props[key]
                : dragZoneDefaults[key];
        });

        Object.keys(dropTargetDefaults).forEach((key) => {
            dropTargetParam[key] = (key in props)
                ? props[key]
                : dropTargetDefaults[key];
        });

        const containerElem = (typeof props.container === 'string') ? ge(props.container) : props.container;
        if (!containerElem) {
            return;
        }

        this.dragZone = SortableDragZone.create(containerElem, dragZoneParam);
        this.dropTarget = SortableDropTarget.create(containerElem, dropTargetParam);
    }
}
