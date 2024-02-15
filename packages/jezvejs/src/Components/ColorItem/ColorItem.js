import { createElement } from '@jezvejs/dom';
import { Component } from '../../Component.js';
import './ColorItem.scss';

/** CSS classes */
const COLOR_ITEM_CLASS = 'color-item';

const defauptProps = {
    value: '',
    colorProp: '--color-item-value',
};

/**
 * Color item component class
 */
export class ColorItem extends Component {
    constructor(props = {}) {
        super({
            ...defauptProps,
            ...props,
        });

        this.state = {
            ...this.props,
        };

        this.init();
        this.postInit();
        this.render(this.state);
    }

    init() {
        this.elem = createElement('div', { props: { className: COLOR_ITEM_CLASS } });
    }

    postInit() {
        this.setClassNames();
    }

    setValue(value) {
        if (this.state.value === value) {
            return;
        }

        this.setState({ ...this.state, value });
    }

    render(state, prevState = {}) {
        if (state.value !== prevState?.value) {
            this.elem.style.setProperty(this.props.colorProp, state.value);
        }
    }
}
