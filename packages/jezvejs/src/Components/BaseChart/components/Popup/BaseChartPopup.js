import { asArray } from '@jezvejs/types';
import { createElement } from '@jezvejs/dom';
import { Component } from '../../../../Component.js';
import './BaseChartPopup.scss';

/* CSS classes */
const POPUP_CONTENT_CLASS = 'chart__popup-content';
const POPUP_LIST_CLASS = 'chart__popup-list';
const POPUP_LIST_ITEM_CLASS = 'chart__popup-list-item';

const defaultProps = {
    target: null,
};

/**
 * Chart legend component
 */
export class BaseChartPopup extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = {
            ...this.props,
        };

        this.init();
        this.render(this.state);
    }

    init() {
        this.elem = createElement('div', {
            props: { className: POPUP_CONTENT_CLASS },
        });
    }

    renderContent(state) {
        const { target } = state;

        if (!target.group) {
            return createElement('span', { props: { textContent: target.item.value } });
        }

        return createElement('ul', {
            props: { className: POPUP_LIST_CLASS },
            children: target.group.map((item) => (
                createElement('li', {
                    props: {
                        className: POPUP_LIST_ITEM_CLASS,
                        textContent: item.value,
                    },
                })
            )),
        });
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        const items = this.renderContent(state);
        this.elem.replaceChildren(...asArray(items));
    }
}
