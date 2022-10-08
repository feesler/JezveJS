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
    static create(props = {}) {
        const instance = new IndetermProgress(props);
        instance.init();
        return instance;
    }

    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.state = { ...this.props };
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

        if (state.run) {
            this.elem.classList.add(RUN_CLASS);
        } else {
            this.elem.classList.remove(RUN_CLASS);
        }
    }
}
