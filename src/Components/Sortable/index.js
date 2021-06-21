import { ge } from '../../js/common.js';
import { SortableDragZone } from './SortableDragZone.js';
import { SortableDropTarget } from './SortableDropTarget.js';

/**
 * Sortable widget constructor
 * @param {Object} params
 * @param {String} params.container - identifier or Element of sortable container
 * @param {String} params.group - sortable group udentifier
 * @param {Function} params.ondragstart - drag start event handler
 * @param {Function} params.oninsertat - drop item on new place event handler
 * @param {boolean} params.table - enable table sort behavior
 * @param {boolean} params.copyWidth - enable copying width of original item to drag avatar
 * @param {String} params.selector - CSS selector for sortable items
 * @param {String} params.placeholderClass - CSS class for placeholder item
 * @param {String} params.dragClass - CSS class for drag avatar
 * @param {boolean} params.onlyRootHandle - enable drag start only on root of item
 * @param {String|String[]} params.handles - CSS selectors for available drag start handles
 */
export class Sortable {
    constructor(params) {
        const props = (typeof params !== 'undefined') ? params : {};
        const dragZoneParam = {};
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
            handles: null,
        };

        const dropTargetParam = {};
        const dropTargetDefaults = {
            group: null,
        };

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

        this.dragZone = new SortableDragZone(containerElem, dragZoneParam);
        this.dropTarget = new SortableDropTarget(containerElem, dropTargetParam);
    }
}
