import { Component, createElement } from 'jezvejs';
import './DemoSection.scss';

/* CSS classes */
const SECTION_CLASS = 'demo-section';
const HEADER_CLASS = 'demo-section__header';
const DESCRIPTION_CLASS = 'demo-section__descr';
const CONTENT_CLASS = 'demo-section__content';

const defaultProps = {
    id: null,
    title: null,
    description: null,
    content: null,
};

/**
 * Demo section component
 */
export class DemoSection extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.init();
    }

    init() {
        const {
            id,
            title,
            description,
            content,
        } = this.props;

        if (typeof id !== 'string' || id.length === 0) {
            throw new Error('Invalid section id');
        }
        if (typeof title !== 'string' || title.length === 0) {
            throw new Error('Invalid section title');
        }

        this.headerElem = createElement('header', {
            props: {
                id,
                className: HEADER_CLASS,
                textContent: title,
            },
        });
        const children = [this.headerElem];

        if (description) {
            const lines = description.split(/[\r\n]+/);
            const descrChilds = [];
            lines.forEach((textContent, index) => {
                descrChilds.push(createElement('span', { props: { textContent } }));
                if (index < lines.length - 1) {
                    descrChilds.push(createElement('br'));
                }
            });

            this.descrElem = createElement('header', {
                props: { className: DESCRIPTION_CLASS },
                children: descrChilds,
            });
            children.push(this.descrElem);
        }

        this.contentElem = createElement('div', {
            props: { className: CONTENT_CLASS },
            children: content,
        });
        children.push(this.contentElem);

        this.elem = createElement('section', {
            props: { className: SECTION_CLASS },
            children,
        });

        this.setClassNames();
    }
}
