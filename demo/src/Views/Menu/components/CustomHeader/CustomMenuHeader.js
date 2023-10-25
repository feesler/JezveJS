import { Component } from 'jezvejs';
import { createElement } from '@jezvejs/dom';
import './CustomMenuHeader.scss';

export class CustomMenuHeader extends Component {
    constructor(props) {
        super(props);

        this.state = { ...this.props };

        this.init();
        this.render(this.state);
    }

    init() {
        this.elem = createElement('div', {
            props: { className: 'custom-header' },
        });
    }

    render(state) {
        this.elem.textContent = state?.title ?? '';
    }
}
