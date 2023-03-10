import {
    createElement,
    createSVGElement,
    getClassName,
    isFunction,
} from '../../../../js/common.js';
import { Component } from '../../../../js/Component.js';

/* CSS classes */
const HEADER_CLASS = 'dp__header';
const HEADER_TITLE_CLASS = 'dp__header_item dp__header_title';
const HEADER_NAV_CLASS = 'dp__header_item dp__header_nav';
const HEADER_NEXT_NAV_CLASS = 'dp__header_nav-next';
const NAV_ICON_CLASS = 'dp__header_nav-icon';

const NAV_ICON_PATH = 'm2 0.47-0.35-0.35-1.6 1.6 1.6 1.6 0.35-0.35-1.2-1.2z';

const defaultProps = {
    onClickTitle: null,
    onClickPrev: null,
    onClickNext: null,
};

/** Header component */
export class DatePickerHeader extends Component {
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
        this.titleEl = createElement('div', {
            props: { className: HEADER_TITLE_CLASS },
        });
        this.navPrevElem = createElement('div', {
            props: { className: HEADER_NAV_CLASS },
            children: this.renderNavIcon(),
        });
        this.navNextElem = createElement('div', {
            props: { className: getClassName(HEADER_NAV_CLASS, HEADER_NEXT_NAV_CLASS) },
            children: this.renderNavIcon(),
        });

        this.elem = createElement('div', {
            props: { className: HEADER_CLASS },
            children: [
                this.navPrevElem,
                this.titleEl,
                this.navNextElem,
            ],
            events: {
                click: (e) => this.onClick(e),
            },
        });
    }

    /** 'click' event handler */
    onClick(e) {
        e.stopPropagation();

        if (this.titleEl.contains(e.target)) {
            if (isFunction(this.props.onClickTitle)) {
                this.props.onClickTitle(e);
            }
            return;
        }

        if (this.navPrevElem.contains(e.target)) {
            if (isFunction(this.props.onClickPrev)) {
                this.props.onClickPrev(e);
            }
            return;
        }

        if (this.navNextElem.contains(e.target)) {
            if (isFunction(this.props.onClickNext)) {
                this.props.onClickNext(e);
            }
        }
    }

    setTitle(title) {
        this.setState({ ...this.state, title });
    }

    renderNavIcon() {
        return createSVGElement('svg', {
            attrs: { class: NAV_ICON_CLASS, viewBox: '0 0 2.1 3.4' },
            children: createSVGElement('path', { attrs: { d: NAV_ICON_PATH } }),
        });
    }

    render(state) {
        this.titleEl.textContent = state.title;
    }
}
