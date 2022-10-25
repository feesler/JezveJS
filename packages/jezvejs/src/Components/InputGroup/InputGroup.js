import { Component } from '../../js/Component.js';
import { createElement, setEvents } from '../../js/common.js';
import '../../css/common.scss';
import './style.scss';

/** CSS classes */
const CONTAINER_CLASS = 'input-group';
const INNER_BUTTON_CLASS = 'input-group__inner-btn';
const INNER_BTN_ACTIVE_CLASS = 'input-group__inner-btn_active';

const textInputTypes = [
    'date',
    'datetime',
    'datetime-local',
    'email',
    'month',
    'number',
    'password',
    'search',
    'tel',
    'text',
    'time',
    'url',
];

export class InputGroup extends Component {
    constructor(props) {
        super(props);

        if (this.elem) {
            this.parse();
        } else {
            this.init();
        }
    }

    init() {
        if (!Array.isArray(this.props.children)) {
            this.props.children = [this.props.children];
        }

        this.elem = createElement('div', { props: { className: CONTAINER_CLASS } });
        this.elem.append(...this.props.children);
        this.queryInputs();

        this.setClassNames();
        this.setHandlers();
    }

    parse() {
        if (!this.elem?.classList?.contains(CONTAINER_CLASS)) {
            throw new Error('Invalid element');
        }

        this.queryInputs();

        this.setClassNames();
        this.setHandlers();
    }

    queryInputs() {
        const allInputs = Array.from(this.elem.querySelectorAll('input'));
        this.inputs = allInputs.filter(
            (input) => textInputTypes.includes(input.type.toLowerCase()),
        );
    }

    setHandlers() {
        const handlers = {
            focus: (e) => this.onFocus(e),
            blur: (e) => this.onBlur(e),
        };

        this.inputs.forEach((input) => setEvents(input, handlers));
    }

    onFocus(e) {
        const input = e.target;
        let prevElem = input.previousElementSibling;
        while (prevElem?.classList?.contains(INNER_BUTTON_CLASS)) {
            prevElem.classList.add(INNER_BTN_ACTIVE_CLASS);
            prevElem = prevElem.previousElementSibling;
        }
    }

    onBlur(e) {
        const input = e.target;
        let prevElem = input.previousElementSibling;
        while (prevElem?.classList?.contains(INNER_BUTTON_CLASS)) {
            prevElem.classList.remove(INNER_BTN_ACTIVE_CLASS);
            prevElem = prevElem.previousElementSibling;
        }
    }
}
