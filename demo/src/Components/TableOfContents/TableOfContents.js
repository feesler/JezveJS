import { Component, createElement } from 'jezvejs';
import { TableOfContentsSection } from './TableOfContentsSection.js';
import './TableOfContents.scss';

/* CSS classes */
const CONTAINER_CLASS = 'toc-menu';
const TOGGLER_CHECKBOX_CLASS = 'toc-menu-check';

const defaultProps = {
    title: 'Table of contents',
    togglerId: 'showTocCheck',
    sections: [],
};

/**
 * Table of contents menu
 */
export class TableOfContents extends Component {
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
        const {
            togglerId,
            title,
        } = this.props;

        this.labelElem = createElement('label', {
            props: { htmlFor: togglerId, textContent: title },
        });
        this.togglerCheckbox = createElement('input', {
            props: { id: togglerId, type: 'checkbox', className: TOGGLER_CHECKBOX_CLASS },
        });

        this.elem = createElement('div', {
            props: { className: CONTAINER_CLASS },
        });
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        this.elem.textContent = '';

        this.labelElem.textContent = state.title;

        const sectionElems = state.sections.map((item) => (
            TableOfContentsSection.create({ ...item }).elem
        ));

        this.elem.append(this.labelElem, this.togglerCheckbox, ...sectionElems);
    }
}
