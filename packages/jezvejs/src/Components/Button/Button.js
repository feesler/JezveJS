import {
    isFunction,
    createElement,
    setEvents,
    enable,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import { Icon } from '../Icon/Icon.js';
import './style.scss';

/* CSS classes */
const CONTAINER_CLASS = 'btn';
const ICON_CLASS = 'btn__icon';
const CONTENT_CLASS = 'btn__content';

const defaultProps = {
    type: 'button', // button, link or static
    enabled: true,
    url: undefined,
    title: undefined,
    icon: undefined,
    onClick: null,
    id: undefined,
    tabIndex: undefined,
};

const buttonTypes = ['button', 'submit', 'reset'];

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

        this.postInit();
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

        this.postInit();
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
            this.elem.tabIndex = (state.enabled)
                ? (this.props.tabIndex ?? '')
                : -1;
        }

        if (state.icon === prevState.icon && state.title === prevState.title) {
            return;
        }

        this.elem.textContent = '';

        if (state.icon) {
            const icon = Icon.create({
                icon: state.icon,
                className: ICON_CLASS,
            });
            this.iconElem = icon.elem;

            const contentElem = createElement('span', {
                props: {
                    className: CONTENT_CLASS,
                    textContent: state.title,
                },
            });

            this.elem.append(icon.elem, contentElem);
        } else {
            this.elem.textContent = state.title ?? '';
        }
    }
}
