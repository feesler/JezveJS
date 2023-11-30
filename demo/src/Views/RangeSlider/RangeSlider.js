import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';
import { RangeSlider } from 'jezvejs/RangeSlider';

import { createContainer, createControls } from '../../Application/utils.js';
import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';

import './RangeSliderView.scss';

const createValueElement = () => {
    const res = createElement('div', { props: { className: 'range-slider-value' } });

    res.renderValue = (rangeSlider) => {
        if (rangeSlider.props.range) {
            const { start, end } = rangeSlider.value;
            res.textContent = `${start} - ${end}`;
        } else {
            res.textContent = rangeSlider.value;
        }
    };

    return res;
};

/**
 * RangeSlider component demo view
 */
class RangeSliderView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initDefault();
        this.initYAxis();
        this.initStyled();
        this.initBeforeArea();
        this.initAfterArea();
        this.initStep();
        this.initRange();
        this.initScrollRange();
        this.initDisabled();
    }

    initDefault() {
        const logsField = LogsField.create();
        const valueElem = createValueElement();

        const rangeSlider = RangeSlider.create({
            onFocus: () => logsField.write('onFocus'),
            onBlur: () => logsField.write('onBlur'),
            onChange: (value) => {
                logsField.write(`onChange value: ${value}`);
                valueElem.renderValue(rangeSlider);
            },
        });

        valueElem.renderValue(rangeSlider);

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [
                createContainer('defaultContainer', [
                    rangeSlider.elem,
                    valueElem,
                ]),
                logsField.elem,
            ],
        });
    }

    initYAxis() {
        const logsField = LogsField.create();
        const valueElem = createValueElement();

        const rangeSlider = RangeSlider.create({
            axis: 'y',
            className: 'vertical',
            onChange: (value) => {
                logsField.write(`onChange value: ${value}`);
                valueElem.renderValue(rangeSlider);
            },
        });

        valueElem.renderValue(rangeSlider);

        this.addSection({
            id: 'yAxis',
            title: 'Vertical',
            content: [
                createContainer('yAxisContainer', [
                    rangeSlider.elem,
                    valueElem,
                ]),
                logsField.elem,
            ],
        });
    }

    initStyled() {
        const valueElem = createValueElement();
        const rangeSlider = RangeSlider.create({
            className: 'styled',
            onChange: () => valueElem.renderValue(rangeSlider),
        });

        valueElem.renderValue(rangeSlider);

        this.addSection({
            id: 'styled',
            title: 'Styled',
            content: createContainer('styledContainer', [
                rangeSlider.elem,
                valueElem,
            ]),
        });
    }

    initBeforeArea() {
        const valueElem = createValueElement();
        const rangeSlider = RangeSlider.create({
            className: 'styled',
            beforeArea: true,
            onChange: () => valueElem.renderValue(rangeSlider),
        });

        valueElem.renderValue(rangeSlider);

        this.addSection({
            id: 'beforeArea',
            title: '\'beforeArea\' option',
            content: createContainer('beforeAreaContainer', [
                rangeSlider.elem,
                valueElem,
            ]),
        });
    }

    initAfterArea() {
        const valueElem = createValueElement();
        const rangeSlider = RangeSlider.create({
            className: 'styled',
            afterArea: true,
            onChange: () => valueElem.renderValue(rangeSlider),
        });

        valueElem.renderValue(rangeSlider);

        this.addSection({
            id: 'afterArea',
            title: '\'afterArea\' option',
            content: createContainer('afterAreaContainer', [
                rangeSlider.elem,
                valueElem,
            ]),
        });
    }

    initStep() {
        const valueElem = createValueElement();
        const rangeSlider = RangeSlider.create({
            className: 'styled',
            step: 0.02,
            min: -10,
            max: 10,
            onChange: () => valueElem.renderValue(rangeSlider),
        });

        valueElem.renderValue(rangeSlider);

        this.addSection({
            id: 'step',
            title: 'Value step',
            description: '\'step\' property is set 0.02',
            content: createContainer('stepContainer', [
                rangeSlider.elem,
                valueElem,
            ]),
        });
    }

    initRange() {
        const logsField = LogsField.create();
        const valueElem = createValueElement();

        const rangeSlider = RangeSlider.create({
            range: true,
            className: 'styled',
            onChange: ({ start, end }) => {
                logsField.write(`onChange start: ${start}, end: ${end}`);
                valueElem.renderValue(rangeSlider);
            },
        });

        valueElem.renderValue(rangeSlider);

        this.addSection({
            id: 'range',
            title: 'Range',
            content: [
                createContainer('rangeContainer', [
                    rangeSlider.elem,
                    valueElem,
                ]),
                logsField.elem,
            ],
        });
    }

    initScrollRange() {
        const logsField = LogsField.create();
        const valueElem = createValueElement();

        const rangeSlider = RangeSlider.create({
            range: true,
            className: 'styled',
            scrollOnClickOutsideRange: true,
            onChange: ({ start, end }) => {
                logsField.write(`onChange start: ${start}, end: ${end}`);
                valueElem.renderValue(rangeSlider);
            },
        });

        valueElem.renderValue(rangeSlider);

        this.addSection({
            id: 'scrollRange',
            title: 'Scroll range',
            description: '\'scrollOnClickOutsideRange\' option is enabled.',
            content: [
                createContainer('scrollRangeContainer', [
                    rangeSlider.elem,
                    valueElem,
                ]),
                logsField.elem,
            ],
        });
    }

    initDisabled() {
        const valueElem = createValueElement();
        const rangeSlider = RangeSlider.create({
            disabled: true,
            onChange: () => valueElem.renderValue(rangeSlider),
        });

        valueElem.renderValue(rangeSlider);

        const toggleEnableBtn = Button.create({
            id: 'toggleEnableBtn',
            className: 'action-btn',
            title: 'Enable',
            onClick: () => {
                const { disabled } = rangeSlider;
                toggleEnableBtn.setTitle((disabled) ? 'Disable' : 'Enable');
                rangeSlider.enable(disabled);
            },
        });

        this.addSection({
            id: 'disabled',
            title: 'Disabled component',
            content: [
                createContainer('disabledContainer', [
                    rangeSlider.elem,
                    valueElem,
                ]),
                createControls(toggleEnableBtn.elem),
            ],
        });
    }
}

RangeSliderView.create();
