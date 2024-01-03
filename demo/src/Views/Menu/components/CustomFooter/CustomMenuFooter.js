import { Component } from 'jezvejs';
import { createElement } from '@jezvejs/dom';
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
            className: 'custom-footer',
        });
    }

    render(state) {
        this.elem.textContent = state?.title ?? '';
    }
}
