import { Component } from 'jezvejs';
import { isFunction } from '@jezvejs/types';
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
            props: { className: 'custom-footer__title' },
        });

        this.elem = createElement('div', {
            props: { className: 'custom-footer' },
            children: [this.titleElem, this.button.elem],
        });
    }

    onSubmit(e) {
        if (isFunction(this.props.onSubmit)) {
            this.props.onSubmit(e);
        }
    }

    render(state) {
        this.titleElem.textContent = state?.title ?? '';
    }
}
