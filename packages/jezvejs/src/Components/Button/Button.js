import { isFunction } from '@jezvejs/types';
import {
    createElement,
    setEvents,
    enable,
    asArray,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { Icon } from '../Icon/Icon.js';
import './Button.scss';

/* CSS classes */
const CONTAINER_CLASS = 'btn';
const ICON_CLASS = 'btn__icon';
const CONTENT_CLASS = 'btn__content';

const defaultProps = {
    type: 'button', // button, link or static
    enabled: true,
    url: undefined,
    title: undefined,
    tooltip: undefined,
    icon: undefined,
    iconAlign: 'left', // available value: 'left', 'right'
    onClick: null,
    id: undefined,
    tabIndex: undefined,
};

const buttonTypes = ['button', 'submit', 'reset'];

const setContent = (elem, content) => {
    const el = elem;
    const cont = content ?? '';

    if (el.tagName === 'INPUT') {
        el.value = cont;
        return;
    }

    const contentItems = asArray(cont).filter((item) => item);
    el.append(...contentItems);
};

/**
 * Button component
 */
export class Button extends Component {
    static userProps = {
        elem: ['id', 'tabIndex'],
    };

    constructor(props) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = { ...this.props };

        if (this.elem) {
            this.parse();
        } else {
            this.init();
        }

        this.postInit();
    }

    /** Returns id of root element of component */
    get id() {
        return this.props.id;
    }

    /** Returns enabled state of component */
    get enabled() {
        return this.state.enabled;
    }

    getTagName(type) {
        if (type === 'link') {
            return 'a';
        }
        if (type === 'static') {
            return 'div';
        }
        if (buttonTypes.includes(type)) {
            return 'button';
        }

        throw new Error('Invalid button type');
    }

    init() {
        const { type } = this.props;
        const tagName = this.getTagName(type);
        const props = { className: CONTAINER_CLASS };
        if (tagName === 'button') {
            props.type = type;
        }
        this.elem = createElement(tagName, { props });
    }

    parse() {
        if (!this.elem) {
            throw new Error('Invalid element specified');
        }

        const { tagName } = this.elem;

        if (tagName === 'A' && typeof this.state.url === 'undefined') {
            this.state.type = 'link';
            this.state.url = this.elem.href;
        } else if (
            tagName === 'BUTTON'
            || (tagName === 'INPUT' && buttonTypes.includes(this.elem.type))
        ) {
            this.state.type = this.elem.type;
        } else {
            this.state.type = 'static';
        }

        if (
            typeof this.props.tabIndex === 'undefined'
            && this.elem.hasAttribute('tabindex')
        ) {
            this.props.tabIndex = this.elem.getAttribute('tabindex');
        }

        const iconElem = this.elem.querySelector(`.${ICON_CLASS}`);
        if (typeof this.state.icon === 'undefined') {
            this.state.icon = iconElem;
        }

        const contentElem = this.elem.querySelector(`.${CONTENT_CLASS}`) ?? this.elem;
        if (typeof this.state.title === 'undefined') {
            this.state.title = contentElem.textContent.trim();
        }

        this.state.enabled = !this.elem.hasAttribute('disabled');
    }

    postInit() {
        this.setClassNames();
        this.setHandlers();
        this.setUserProps();
        this.render(this.state);
    }

    setHandlers() {
        setEvents(this.elem, {
            touchstart: () => { },
            click: (e) => this.onClick(e),
        });
    }

    onClick(e) {
        if (!this.state.enabled) {
            e.preventDefault();
            return;
        }

        if (isFunction(this.props.onClick)) {
            this.props.onClick(e);
        }
    }

    /** Enables/disabled component */
    enable(value = true) {
        if (this.state.enabled === !!value) {
            return;
        }

        this.setState({ ...this.state, enabled: !!value });
    }

    /** Set icon */
    setIcon(icon) {
        if (icon && typeof icon !== 'string') {
            throw new Error('Invalid icon specified');
        }

        if (this.state.icon === icon) {
            return;
        }

        this.setState({ ...this.state, icon });
    }

    /** Set title text */
    setTitle(title) {
        if (title && typeof title !== 'string') {
            throw new Error('Invalid title specified');
        }

        if (this.state.title === title) {
            return;
        }

        this.setState({ ...this.state, title });
    }

    /** Set URL for link element */
    setURL(url) {
        if (typeof url !== 'string') {
            throw new Error('Invalid URL specified');
        }

        if (this.state.url === url) {
            return;
        }

        this.setState({ ...this.state, url });
    }

    /** Render component */
    render(state, prevState = {}) {
        enable(this.elem, state.enabled);

        if (state.type === 'link') {
            this.elem.href = state.url ?? '';
        }

        if (state.enabled && typeof this.props.tabIndex !== 'undefined') {
            this.elem.setAttribute('tabindex', this.props.tabIndex);
        } else {
            this.elem.removeAttribute('tabindex');
        }

        const tooltip = state.tooltip ?? null;
        this.elem.title = (tooltip === null && typeof state.title === 'string')
            ? state.title
            : (tooltip ?? '');

        if (
            state.icon === prevState.icon
            && state.title === prevState.title
            && state.iconAlign === prevState.iconAlign
        ) {
            return;
        }

        const title = state.title ?? '';
        this.elem.textContent = '';
        if (!state.icon || this.elem.tagName === 'INPUT') {
            setContent(this.elem, title);
            return;
        }

        const icon = Icon.create({
            icon: state.icon,
            className: ICON_CLASS,
        });
        this.elem.append(icon.elem);

        if (title.length === 0) {
            return;
        }

        const contentElem = createElement('span', { props: { className: CONTENT_CLASS } });
        setContent(contentElem, title);

        if (state.iconAlign === 'left') {
            this.elem.append(contentElem);
        } else {
            this.elem.prepend(contentElem);
        }
    }
}
