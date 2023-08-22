import { Component, createElement } from 'jezvejs';
import './CustomMenuFooter.scss';

export class CustomMenuFooter extends Component {
    constructor(props) {
        super(props);

        this.state = { ...this.props };

        this.init();
        this.render(this.state);
    }

    init() {
        this.elem = createElement('div', {
            props: { className: 'custom-footer' },
        });
    }

    render(state) {
        this.elem.textContent = state?.title ?? '';
    }
}