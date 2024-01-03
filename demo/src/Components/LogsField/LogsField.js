import { Component } from 'jezvejs';
import { createElement } from '@jezvejs/dom';
import { generateId } from '../../Application/utils.js';
import './LogsField.scss';

/* CSS classes */
const FIELD_CLASS = 'logs-container';

const defaultProps = {
    inputId: undefined,
    title: 'Event log',
    scrollToBottom: true,
};

/**
 * Textarea field
 */
export class LogsField extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            inputId: props.inputId ?? generateId(),
        });

        this.init();
    }

    init() {
        this.textarea = createElement('textarea', {
            id: this.props.inputId,
        });
        this.label = createElement('label', {
            htmlFor: this.props.inputId,
            textContent: this.props.title,
        });

        this.elem = createElement('div', {
            className: FIELD_CLASS,
            children: [
                this.label,
                this.textarea,
            ],
        });
    }

    write(value) {
        this.textarea.value += `${value}\r\n`;

        if (this.props.scrollToBottom) {
            this.textarea.scrollTop = this.textarea.scrollHeight;
        }
    }
}
