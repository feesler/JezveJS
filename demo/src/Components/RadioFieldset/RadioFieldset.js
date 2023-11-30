import { asArray } from '@jezvejs/types';
import { Component } from 'jezvejs';
import { Radio } from 'jezvejs/Radio';

import './RadioFieldset.scss';
import { createElement } from '@jezvejs/dom';

const FIELDSET_CLASS = 'radio-fieldset';

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
            props: { textContent: title },
        });

        this.radios = asArray(items).map((item) => (
            Radio.create({
                id: `${item.value}${radioName}Radio`,
                value: item.value,
                label: item.label,
                name: radioName,
                checked: item.checked ?? false,
                onChange: () => (
                    this.props?.onChange?.(item.value)
                ),
            }).elem
        ));

        this.elem = createElement('fieldset', {
            props: { className: FIELDSET_CLASS },
            children: [
                this.legendElem,
                ...this.radios,
            ],
        });
    }
}
