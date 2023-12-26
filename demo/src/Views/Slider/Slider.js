import 'jezvejs/style';
import { createElement } from '@jezvejs/dom';
import { Button } from 'jezvejs/Button';
import { Slider } from 'jezvejs/Slider';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { createContainer, createControls } from '../../Application/utils.js';
import './SliderView.scss';

const createSlideContent = (text) => createElement('div', {
    props: { className: 'slide-content', textContent: text },
});

const createSliderControls = (slider) => (
    createControls([
        Button.create({
            className: 'action-btn slide-to-start-btn',
            title: 'Slide to start',
            onClick: () => slider.slideTo(0),
        }).elem,
        Button.create({
            className: 'action-btn slide-to-prev-btn',
            title: 'Prev',
            onClick: () => slider.slideToPrev(),
        }).elem,
        Button.create({
            className: 'action-btn slide-to-next-btn',
            title: 'Next',
            onClick: () => slider.slideToNext(),
        }).elem,
        Button.create({
            className: 'action-btn switch-to-start-btn',
            title: 'Switch to start',
            onClick: () => slider.switchTo(0),
        }).elem,
    ])
);

/**
 * Slider component demo view
 */
class SliderView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('Slider');

        this.initDefaultSlider();
        this.initVerticalSlider();
        this.initMouseSlider();
        this.initNoTouchSlider();
        this.initNoWheelSlider();
    }

    initDefaultSlider() {
        const slider = new Slider({
            width: 300,
            height: 200,
            items: [{
                id: 'horslide',
                name: 'horslide-1',
                content: createSlideContent('Slide 1'),
            }, {
                name: 'horslide-2',
                content: createSlideContent('Slide 2'),
            }, {
                name: 'horslide-3',
                content: createSlideContent('Slide 3'),
            }],
        });

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [
                createContainer('defaultSlider', slider.elem),
                createSliderControls(slider),
            ],
        });
    }

    initVerticalSlider() {
        const slider = new Slider({
            width: 300,
            height: 200,
            vertical: true,
        });
        slider.addSlide({
            id: 'vslide',
            name: 'vertslide-1',
            content: createSlideContent('Slide 1'),
        });
        slider.addSlide({
            name: 'vertslide-2',
            content: createSlideContent('Slide 2'),
        });
        slider.addSlide({
            name: 'vertslide-3',
            content: createSlideContent('Slide 3'),
        });

        this.addSection({
            id: 'placeholder',
            title: 'Vertical',
            content: [
                createContainer('verticalSlider', slider.elem),
                createSliderControls(slider),
            ],
        });
    }

    initMouseSlider() {
        const slider = new Slider({
            width: 300,
            height: 200,
            allowMouse: true,
            items: [{
                content: createSlideContent('Slide 1'),
            }, {
                content: createSlideContent('Slide 2'),
            }, {
                content: createSlideContent('Slide 3'),
            }],
        });

        this.addSection({
            id: 'allowMouse',
            title: 'Enabled \'allowMouse\' option',
            content: createContainer('mouseSlider', slider.elem),
        });
    }

    initNoTouchSlider() {
        const slider = new Slider({
            width: 300,
            height: 200,
            allowTouch: false,
            items: [{
                content: createSlideContent('Slide 1'),
            }, {
                content: createSlideContent('Slide 2'),
            }, {
                content: createSlideContent('Slide 3'),
            }],
        });

        this.addSection({
            id: 'allowTouch',
            title: 'Disabled \'allowTouch\' option',
            content: [
                createContainer('noTouchSlider', slider.elem),
                createSliderControls(slider),
            ],
        });
    }

    initNoWheelSlider() {
        const slider = new Slider({
            width: 300,
            height: 200,
            allowWheel: false,
            items: [{
                content: createSlideContent('Slide 1'),
            }, {
                content: createSlideContent('Slide 2'),
            }, {
                content: createSlideContent('Slide 3'),
            }],
        });

        this.addSection({
            id: 'allowWheel',
            title: 'Disabled \'allowWheel\' option',
            content: createContainer('noWheelSlider', slider.elem),
        });
    }
}

SliderView.create();
