import { createElement } from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './style.scss';

/** CSS classes */
const CONTAINER_CLASS = 'progress';
const PROGRESS_BAR_CLASS = 'progress-bar';

const defaultProps = {
    value: 0,
};

export class Progress extends Component {
    static create(props = {}) {
        const instance = new Progress(props);
        instance.init();
        return instance;
    }

    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.props.value = this.normalizeValue(this.props.value);
        this.state = { ...this.props };
    }

    get value() {
        return this.state.value;
    }

    init() {
        this.bar = createElement('div', { props: { className: PROGRESS_BAR_CLASS } });
        this.elem = createElement('div', {
            props: { className: CONTAINER_CLASS },
            children: this.bar,
        });
        this.setClassNames();

        this.render(this.state);
    }

    normalizeValue(value) {
        let res = parseInt(value, 10);
        if (Number.isNaN(res)) {
            throw new Error('Invalid progress value');
        }

        res = Math.max(0, res);
        res = Math.min(100, res);
        return res;
    }

    setProgress(progress) {
        const value = this.normalizeValue(progress);
        if (this.state.value === value) {
            return;
        }

        this.setState({
            ...this.state,
            value,
        });
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

        this.bar.style.width = `${state.value}%`;
    }
}
