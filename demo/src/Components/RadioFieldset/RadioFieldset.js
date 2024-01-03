import { asArray } from '@jezvejs/types';
import { Component } from 'jezvejs';
import { Radio } from 'jezvejs/Radio';

import './RadioFieldset.scss';
import { createElement } from '@jezvejs/dom';

const FORM_CLASS = 'radio-form';
const FIELDSET_CLASS = 'radio-fieldset';
const CONTENT_CLASS = 'radio-fieldset__content';

const defaultProps = {
    title: null,
    items: [],
    radioName: null,
    onChange: null,
};

export class RadioFieldset extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        this.init();
    }

    init() {
        const { title, items, radioName } = this.props;

        this.legendElem = createElement('legend', {
            textContent: title,
        });

        this.radios = asArray(items).map((item) => (
            Radio.create({
                id: `${item.value}${radioName}Radio`,
                value: item.value,
                label: item.label,
                name: radioName,
                checked: item.checked ?? false,
                className: item.className,
                onChange: () => (
                    this.props?.onChange?.(item.value)
                ),
            }).elem
        ));

        this.contentContainer = createElement('div', {
            className: CONTENT_CLASS,
            children: this.radios,
        });

        this.fieldset = createElement('fieldset', {
            className: FIELDSET_CLASS,
            children: [
                this.legendElem,
                this.contentContainer,
            ],
        });

        this.elem = createElement('form', {
            className: FORM_CLASS,
            children: this.fieldset,
        });

        this.setClassNames();
    }
}
