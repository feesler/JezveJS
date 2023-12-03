import { Component } from 'jezvejs';
import { createElement } from '@jezvejs/dom';

import './PopupContainer.scss';

/* CSS classes */
const POPUP_CONTAINER_CLASS = 'popup-container';
const POPUP_HEADER_CLASS = 'popup-header';
const POPUP_ITEM_CLASS = 'popup-list-item';

const defaultProps = {
    header: 'Popup content',
    itemsCount: 5,
};

/**
 * Popup container component for PopupPosition demo
 */
export class PopupContainer extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.init();
    }

    init() {
        const listItems = [];
        for (let i = 1; i <= this.props.itemsCount; i += 1) {
            const item = this.createListItem(`Item ${i}`);
            listItems.push(item);
        }

        this.elem = createElement('div', {
            props: {
                className: POPUP_CONTAINER_CLASS,
            },
            children: [
                this.createHeader(this.props.header),
                ...listItems,
            ],
        });

        this.hide();
    }

    createHeader(textContent) {
        return createElement('div', {
            props: {
                className: POPUP_HEADER_CLASS,
                textContent,
            },
        });
    }

    createListItem(textContent) {
        return createElement('div', {
            props: {
                className: POPUP_ITEM_CLASS,
                textContent,
            },
        });
    }
}
