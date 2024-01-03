import {
    createElement,
    createSVGElement,
    getClassName,
} from '@jezvejs/dom';
import { Component } from '../../../../Component.js';
import './Header.scss';

/* CSS classes */
const HEADER_CLASS = 'dp__header';
const HEADER_TITLE_CLASS = 'dp__header_item dp__header_title';
const HEADER_TITLE_PLACEHOLDER_CLASS = 'dp__header_item dp__header-placeholder';
const HEADER_NAV_CLASS = 'dp__header_item dp__header_nav';
const HEADER_NEXT_NAV_CLASS = 'dp__header_nav-next';
const NAV_ICON_CLASS = 'dp__header_nav-icon';

const NAV_ICON_PATH = 'm2 0.47-0.35-0.35-1.6 1.6 1.6 1.6 0.35-0.35-1.2-1.2z';

const defaultProps = {
    title: null,
    secondTitle: null,
    doubleView: false,
    focusable: false,
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
        const { focusable } = this.props;
        const tagName = (focusable) ? 'button' : 'div';
        const type = (focusable) ? 'button' : undefined;

        this.navPrevElem = createElement(tagName, {
            type,
            className: HEADER_NAV_CLASS,
            children: this.renderNavIcon(),
        });

        this.titleEl = createElement(tagName, {
            type,
            className: HEADER_TITLE_CLASS,
        });

        this.navNextElem = createElement(tagName, {
            type,
            className: getClassName(HEADER_NAV_CLASS, HEADER_NEXT_NAV_CLASS),
            children: this.renderNavIcon(),
        });

        this.elem = createElement('div', {
            className: HEADER_CLASS,
            events: {
                click: (e) => this.onClick(e),
            },
        });
    }

    /** 'click' event handler */
    onClick(e) {
        e.stopPropagation();

        const isTitle = this.titleEl.contains(e.target);
        const isSecondTitle = this.state.doubleView && this.secondTitleEl?.contains(e.target);
        if (isTitle || isSecondTitle) {
            this.notifyEvent('onClickTitle', { e, secondViewTransition: isSecondTitle });
            return;
        }

        if (this.navPrevElem.contains(e.target)) {
            this.notifyEvent('onClickPrev', { e });
            return;
        }

        if (this.navNextElem.contains(e.target)) {
            this.notifyEvent('onClickNext', { e });
        }
    }

    setTitle(title) {
        this.setState({
            ...this.state,
            title,
            doubleView: false,
        });
    }

    setDoubleTitle(title, secondTitle) {
        this.setState({
            ...this.state,
            title,
            secondTitle,
            doubleView: true,
        });
    }

    renderNavIcon() {
        return createSVGElement('svg', {
            attrs: { class: NAV_ICON_CLASS, viewBox: '0 0 2.1 3.4' },
            children: createSVGElement('path', { attrs: { d: NAV_ICON_PATH } }),
        });
    }

    render(state, prevState = {}) {
        if (
            state.title === prevState?.title
            && state.secondTitle === prevState?.secondTitle
            && state.doubleView === prevState?.doubleView
        ) {
            return;
        }

        const children = [
            this.navPrevElem,
            this.titleEl,
        ];

        if (state.doubleView) {
            const titlePlaceholder = createElement('div', {
                className: HEADER_TITLE_PLACEHOLDER_CLASS,
            });

            const tagName = (this.props.focusable) ? 'button' : 'div';
            this.secondTitleEl = createElement(tagName, {
                type: (this.props.focusable) ? 'button' : undefined,
                className: HEADER_TITLE_CLASS,
            });
            children.push(titlePlaceholder, this.secondTitleEl);
        }

        children.push(this.navNextElem);

        this.elem.replaceChildren(...children);

        this.titleEl.textContent = state.title;
        if (this.secondTitleEl) {
            this.secondTitleEl.textContent = state.secondTitle;
        }
    }
}
