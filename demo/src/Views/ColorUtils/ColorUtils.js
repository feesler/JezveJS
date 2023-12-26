import 'jezvejs/style';
import 'jezvejs/style/Input';
import {
    MAX_HUE,
    MAX_LIGHTNESS,
    MAX_SATURATION,
    hslToRGB,
    rgbToColor,
} from '@jezvejs/color';
import { createElement } from '@jezvejs/dom';

import { createControls } from '../../Application/utils.js';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { RangeInputField } from '../../Components/RangeInputField/RangeInputField.js';

import './ColorUtilsView.scss';

/**
 * Color utilities demo view
 */
class ColorUtilsView extends DemoView {
    onStart() {
        this.setMainHeading('Color utils');

        this.initGenerator();
    }

    initGenerator() {
        const content = createElement('div', { props: { className: 'scrollable-container' } });
        let hueStepsField = null;
        let lightnessStepsField = null;

        const renderContent = () => {
            content.textContent = '';
            content.append(this.generateColors({
                hueSteps: parseInt(hueStepsField.value, 10),
                lightnessSteps: parseInt(lightnessStepsField.value, 10),
            }));
        };

        hueStepsField = RangeInputField.create({
            min: 5,
            max: 50,
            value: 20,
            title: 'Hue steps',
            onChange: renderContent,
        });
        lightnessStepsField = RangeInputField.create({
            min: 5,
            max: 50,
            value: 10,
            title: 'Lightness steps',
            onChange: renderContent,
        });
        const controls = createControls([
            hueStepsField.elem,
            lightnessStepsField.elem,
        ]);

        renderContent();

        this.addSection({
            id: 'default',
            title: 'Generate colors',
            content: [
                content,
                controls,
            ],
        });
    }

    generateColors(options = {}) {
        const {
            hueSteps = 20,
            lightnessSteps = 10,
        } = options;

        const hueStep = MAX_HUE / hueSteps;
        const lightnessStep = MAX_LIGHTNESS / (lightnessSteps + 2);

        const res = createElement('div', { props: { className: 'colors-container' } });

        for (let j = 1; j <= lightnessSteps; j += 1) {
            const row = createElement('div', { props: { className: 'colors-row' } });
            const hsl = {
                hue: 0,
                lightness: (lightnessStep * j),
                saturation: MAX_SATURATION,
            };

            for (let i = 0; i < hueSteps; i += 1) {
                hsl.hue = (hueStep * i) % MAX_HUE;

                const color = rgbToColor(hslToRGB(hsl));
                row.append(this.createColorItem(color));
            }

            res.append(row);
        }

        return res;
    }

    createColorItem(color) {
        const res = createElement('div', {
            props: { className: 'color-item' },
        });
        res.style.setProperty('--color-item-value', color);

        return res;
    }
}

ColorUtilsView.create();
