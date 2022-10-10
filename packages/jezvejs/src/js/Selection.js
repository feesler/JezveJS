import { childCount } from './common.js';

/* eslint-disable no-redeclare */

/** Selection class constructor */
export class Selection {
    constructor() {
        this.selected = {};
    }

    isSelected(id) {
        return (id in this.selected);
    }

    select(id, obj) {
        if (!id || this.isSelected(id)) {
            return false;
        }

        this.selected[id] = obj;

        return true;
    }

    deselect(id) {
        if (!id || !this.isSelected(id)) {
            return false;
        }

        delete this.selected[id];

        return true;
    }

    count() {
        return childCount(this.selected);
    }

    getIdArray() {
        return Object.keys(this.selected);
    }

    clear() {
        this.selected = {};
    }
}
