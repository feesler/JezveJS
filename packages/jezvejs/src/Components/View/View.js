import { onReady } from '@jezvejs/dom';
import { Component } from '../../js/Component.js';

/**
 * View component
 */
export class View extends Component {
    constructor(props = {}) {
        super(props);

        onReady(() => this.onReady());
    }

    /**
     * 'DOMContentLoaded' event handler
     */
    onReady() {
        this.preStart();
        this.onStart();
        this.postStart();
    }

    /**
     * View initialization
     */
    onStart() { }

    /**
     * View pre initialization handler
     */
    preStart() { }

    /**
     * View post initialization handler
     */
    postStart() { }
}
