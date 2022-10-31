import { createElement } from '../../js/common.js';
import { Component } from '../../js/Component.js';
import '../../css/common.scss';
import './style.scss';

/** CSS classes */
const PROGRESS_CLASS = 'indeterm-progress';
const CIRCLE_CLASS = 'indeterm-progress__circle';
const RUN_CLASS = 'run';

const defaultProps = {
    circlesCount: 5,
    run: true,
};

export class IndetermProgress extends Component {
    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.state = { ...this.props };

        this.init();
    }

    get running() {
        return this.state.run;
    }

    init() {
        this.elem = createElement('div', { props: { className: PROGRESS_CLASS } });

        this.circles = [];
        for (let i = 0; i < this.props.circlesCount; i += 1) {
            this.circles.push(createElement('div', { props: { className: CIRCLE_CLASS } }));
        }
        this.elem.append(...this.circles);

        this.setClassNames();

        this.render(this.state);
    }

    start() {
        this.setState({ ...this.state, run: true });
    }

    stop() {
        this.setState({ ...this.state, run: false });
    }

    /** Render component state */
    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.elem.classList.toggle(RUN_CLASS, !!state.run);
    }
}
