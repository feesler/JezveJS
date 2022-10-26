import { ge } from '../../js/common.js';
import { SortableDragZone } from './SortableDragZone.js';
import { SortableDropTarget } from './SortableDropTarget.js';

/**
 * Sortable widget constructor
 * @param {Object} props
 * @param {String} props.elem - identifier or Element of sortable container
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
    constructor(props = {}) {
        this.elem = (typeof props.elem === 'string') ? ge(props.elem) : props.elem;
        if (!this.elem) {
            return;
        }

        this.props = {
            ...props,
            elem: this.elem,
        };

        this.dragZone = SortableDragZone.create(this.props);
        this.dropTarget = SortableDropTarget.create(this.props);
    }
}
