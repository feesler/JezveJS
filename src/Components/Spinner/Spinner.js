import { createElement } from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './style.scss';

const SPINNER_CLASS = 'spinner';
const defaultProps = {};

export class Spinner extends Component {
    static create(props = {}) {
        const instance = new Spinner(props);
        instance.init();
        return instance;
    }

    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };
    }

    init() {
        this.state = {};

        this.elem = createElement('div', { props: { className: SPINNER_CLASS } });
        this.setClassNames();

        this.render(this.state);
    }

    setState(state) {
        if (this.state === state) {
            return;
        }

        this.state = state;

        this.render(this.state);
    }

    /** Render component state */
    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }
    }
}
