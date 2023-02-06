import {
    isFunction,
    createElement,
    setEvents,
    enable,
    re,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { Icon } from '../Icon/Icon.js';
import './style.scss';

/* CSS classes */
const CONTAINER_CLASS = 'btn';
const ICON_CLASS = 'btn__icon';
const CONTENT_CLASS = 'btn__content';
const TITLE_CLASS = 'btn__title';
const SUBTITLE_CLASS = 'btn__subtitle';

const defaultProps = {
    type: 'button', // button or link
    enabled: true,
    url: undefined,
    title: undefined,
    subtitle: undefined,
    icon: undefined,
    onClick: null,
    id: undefined,
    tabIndex: undefined,
};

/**
 * Button component
 */
export class Button extends Component {
    static userProps = {
        elem: ['id', 'tabIndex'],
    };

    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.state = {
            ...this.props,
        };

        if (this.elem) {
            this.parse();
        } else {
            this.init();
        }
    }

    /** Returns id of root element of component */
    get id() {
        return this.props.id;
    }

    /** Returns enabled state of component */
    get enabled() {
        return this.state.enabled;
    }

    init() {
        const isLink = (this.props.type === 'link');
        if (isLink) {
            this.elem = createElement('a', {
                props: { className: CONTAINER_CLASS },
            });
        } else {
            this.elem = createElement('button', {
                props: { className: CONTAINER_CLASS, type: 'button' },
            });
        }

        this.postInit();
    }

    parse() {
        if (!this.elem) {
            throw new Error('Invalid element specified');
        }

        if (this.elem.tagName === 'A' && typeof this.state.url === 'undefined') {
            this.state.type = 'link';
            this.state.url = this.elem.href;
        }

        if (
            typeof this.props.tabIndex === 'undefined'
            && this.elem.hasAttribute('tabindex')
        ) {
            this.props.tabIndex = this.elem.getAttribute('tabindex');
        }

        this.iconElem = this.elem.querySelector(`.${ICON_CLASS}`);
        if (typeof this.state.icon === 'undefined') {
            this.state.icon = this.iconElem;
        }

        this.contentElem = this.elem.querySelector(`.${CONTENT_CLASS}`);
        if (this.contentElem) {
            const titleElem = this.contentElem.querySelector(`.${TITLE_CLASS}`);
            if (typeof this.state.title === 'undefined') {
                this.state.title = (titleElem)
                    ? titleElem.textContent.trim()
                    : this.contentElem.textContent.trim();
            }

            const subtitleElem = this.contentElem.querySelector(`.${SUBTITLE_CLASS}`);
            if (typeof this.state.subtitle === 'undefined') {
                this.state.subtitle = (subtitleElem)
                    ? subtitleElem.textContent.trim()
                    : null;
            }
        }

        this.state.enabled = !this.elem.hasAttribute('disabled');

        this.postInit();
    }

    postInit() {
        this.setClassNames();
        this.setHandlers();
        this.setUserProps();
        this.render(this.state);
    }

    setHandlers() {
        setEvents(this.elem, { click: (e) => this.onClick(e) });
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

    /** Set title text */
    enable(value) {
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
        if (typeof title !== 'string') {
            throw new Error('Invalid title specified');
        }

        if (this.state.title === title) {
            return;
        }

        this.setState({ ...this.state, title });
    }

    /** Set subtitle text */
    setSubtitle(subtitle) {
        if (subtitle && typeof subtitle !== 'string') {
            throw new Error('Invalid subtitle specified');
        }

        if (this.state.subtitle === subtitle) {
            return;
        }

        this.setState({ ...this.state, subtitle });
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

    renderIcon(state, prevState) {
        if (state.icon === prevState.icon) {
            return;
        }

        re(this.iconElem);
        if (!state.icon) {
            return;
        }

        const icon = Icon.create({
            icon: state.icon,
            className: ICON_CLASS,
        });
        this.iconElem = icon.elem;
        this.elem.prepend(this.iconElem);
    }

    renderContent(state, prevState) {
        if (state.title === prevState.title && state.subtitle === prevState.subtitle) {
            return;
        }

        re(this.contentElem);
        if (!state.title) {
            return;
        }

        this.contentElem = createElement('div', {
            props: { className: CONTENT_CLASS },
            children: [
                createElement('span', {
                    props: {
                        className: (state.subtitle) ? TITLE_CLASS : '',
                        textContent: state.title,
                    },
                }),
            ],
        });
        if (state.subtitle) {
            const subtitleElem = createElement('span', {
                props: { className: SUBTITLE_CLASS, textContent: state.subtitle },
            });
            this.contentElem.append(subtitleElem);
        }

        this.elem.append(this.contentElem);
    }

    /** Render component */
    render(state, prevState = {}) {
        enable(this.elem, state.enabled);

        if (state.type === 'link') {
            this.elem.href = state.url ?? '';
            this.elem.tabIndex = (state.enabled)
                ? (this.props.tabIndex ?? '')
                : -1;
        }

        this.renderIcon(state, prevState);
        this.renderContent(state, prevState);
    }
}