import { Component } from 'jezvejs';
import { createElement } from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';
import './CustomDatePickerFooter.scss';

const defaultProps = {
    title: null,
    onSubmit: null,
};

export class CustomDatePickerFooter extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.state = { ...this.props };

        this.init();
        this.render(this.state);
    }

    init() {
        this.button = Button.create({
            title: 'Ok',
            className: 'action-btn',
            onClick: (e) => this.onSubmit(e),
        });

        this.titleElem = createElement('div', {
            className: 'custom-footer__title',
        });

        this.elem = createElement('div', {
            className: 'custom-footer',
            children: [this.titleElem, this.button.elem],
        });
    }

    onSubmit(e) {
        this.notifyEvent('onSubmit', e);
    }

    render(state) {
        this.titleElem.textContent = state?.title ?? '';
    }
}
