import 'jezvejs/style';
import { Button } from 'jezvejs/Button';
import { RangeSlider } from 'jezvejs/RangeSlider';

import { createContainer, createControls } from '../../Application/utils.js';
import { DemoView } from '../../Components/DemoView/DemoView.js';
import { LogsField } from '../../Components/LogsField/LogsField.js';

import './RangeSliderView.scss';

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
        this.initRange();
        this.initDisabled();
    }

    initDefault() {
        const logsField = LogsField.create();

        const rangeSlider = RangeSlider.create({
            onFocus: () => logsField.write('onFocus'),
            onBlur: () => logsField.write('onBlur'),
            onChange: (value) => logsField.write(`onChange value: ${value}`),
        });

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [
                createContainer('defaultContainer', rangeSlider.elem),
                logsField.elem,
            ],
        });
    }

    initYAxis() {
        const logsField = LogsField.create();

        const rangeSlider = RangeSlider.create({
            axis: 'y',
            className: 'vertical',
            onChange: (value) => logsField.write(`onChange value: ${value}`),
        });

        this.addSection({
            id: 'yAxis',
            title: 'Vertical',
            content: [
                createContainer('yAxisContainer', rangeSlider.elem),
                logsField.elem,
            ],
        });
    }

    initStyled() {
        const rangeSlider = RangeSlider.create({
            className: 'styled',
        });

        this.addSection({
            id: 'styled',
            title: 'Styled',
            content: createContainer('styledContainer', rangeSlider.elem),
        });
    }

    initRange() {
        const logsField = LogsField.create();

        const rangeSlider = RangeSlider.create({
            range: true,
            className: 'styled',
            onChange: ({ start, end }) => logsField.write(`onChange start: ${start}, end: ${end}`),
        });

        this.addSection({
            id: 'range',
            title: 'Range',
            content: [
                createContainer('rangeContainer', rangeSlider.elem),
                logsField.elem,
            ],
        });
    }

    initDisabled() {
        const rangeSlider = RangeSlider.create({
            disabled: true,
        });

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
                createContainer('disabledContainer', rangeSlider.elem),
                createControls(toggleEnableBtn.elem),
            ],
        });
    }
}

RangeSliderView.create();
