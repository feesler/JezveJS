import { createElement } from '@jezvejs/dom';
import { Component } from '../../Component.js';
import '../../common.scss';
import './Spinner.scss';

const SPINNER_CLASS = 'spinner';
const defaultProps = {};

export class Spinner extends Component {
    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.init();
    }

    init() {
        this.elem = createElement('div', { props: { className: SPINNER_CLASS } });
        this.setClassNames();

        this.render(this.state);
    }
}
