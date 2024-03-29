import { asArray } from '@jezvejs/types';
import { createElement } from '@jezvejs/dom';
import { Component } from '../../Component.js';
import '../../common.scss';
import './InputGroup.scss';

/** CSS classes */
const CONTAINER_CLASS = 'input-group';

/** Input group component */
export class InputGroup extends Component {
    static userProps = {
        elem: ['id'],
    };

    constructor(props) {
        super(props);

        if (this.elem) {
            this.parse();
        } else {
            this.init();
        }
        this.postInit();
    }

    init() {
        this.elem = createElement('div', { className: CONTAINER_CLASS });

        this.props.children = asArray(this.props.children).filter((item) => !!item);
        if (this.props.children.length > 0) {
            this.elem.append(...this.props.children);
        }
    }

    parse() {
        if (!this.elem?.classList?.contains(CONTAINER_CLASS)) {
            throw new Error('Invalid element');
        }
    }

    postInit() {
        this.setClassNames();
        this.setUserProps();
    }
}
