import {
    createElement,
    createSVGElement,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';

/* CSS classes */
const LIST_ITEM_CLASS = 'dd__list-item';
const CHECK_ICON_CLASS = 'dd__check-icon';
const LIST_ITEM_ACTIVE_CLASS = 'dd__list-item_active';
const SELECTED_LIST_ITEM_CLASS = 'dd__list-item_selected';

/* Check icon path */
const CHECK_ICON = 'M1.08 4.93a.28.28 0 000 .4l2.35 2.34c.1.11.29.11.4 0l4.59-4.59a.28.28 0 000-.4l-.6-.6a.28.28 0 00-.4 0l-3.8 3.8-1.54-1.55a.28.28 0 00-.4 0z';

const defaultProps = {
    selected: false,
    active: false,
    hidden: false,
    disabled: false,
    multi: false,
    group: null,
};

export class DropDownListItem extends Component {
    static get className() {
        return LIST_ITEM_CLASS;
    }

    static get selector() {
        return 'li';
    }

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        if (typeof this.props.id === 'undefined' || this.props.id === null) {
            throw new Error('Invalid id');
        }

        this.state = {
            ...this.props,
            id: this.props.id.toString(),
        };

        this.init();
        this.render(this.state);
    }

    get id() {
        return this.state.id;
    }

    init() {
        this.contentElem = createElement('div', { props: { className: LIST_ITEM_CLASS } });

        if (this.props.multi) {
            this.checkIcon = createSVGElement('svg', {
                attrs: {
                    class: CHECK_ICON_CLASS,
                    width: 17,
                    height: 17,
                    viewBox: '0 1 10 10',
                },
                children: createSVGElement('path', { attrs: { d: CHECK_ICON } }),
            });
            this.titleElem = createElement('span');
            this.contentElem.append(this.checkIcon, this.titleElem);
        } else {
            this.titleElem = this.contentElem;
        }

        this.elem = createElement('li', {
            children: this.contentElem,
        });
    }

    render(state) {
        this.titleElem.title = state.title;
        this.titleElem.textContent = state.title;

        const selected = (this.props.multi && state.selected);
        this.contentElem.classList.toggle(SELECTED_LIST_ITEM_CLASS, selected);
        this.contentElem.classList.toggle(LIST_ITEM_ACTIVE_CLASS, state.active);

        this.elem.dataset.id = state.id;
        this.enable(!state.disabled);
        this.show(!state.hidden);
    }
}
