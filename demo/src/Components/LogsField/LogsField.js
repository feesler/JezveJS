import { Component, createElement } from 'jezvejs';
import './LogsField.scss';

/* CSS classes */
const FIELD_CLASS = 'logs-container';

const defaultProps = {
    title: 'Event log',
};

/**
 * Textarea field
 */
export class LogsField extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.init();
    }

    init() {
        this.textarea = createElement('textarea');
        this.label = createElement('label', { props: { textContent: this.props.title } });

        this.elem = createElement('div', {
            props: { className: FIELD_CLASS },
            children: [
                this.label,
                this.textarea,
            ],
        });
    }

    write(value) {
        this.textarea.value += `${value}\r\n`;
    }
}
