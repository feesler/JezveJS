import 'jezvejs/style';
import 'jezvejs/style/Button';
import {
    createElement,
    ge,
    onReady,
    setEvents,
} from 'jezvejs';
import { Slider } from 'jezvejs/Slider';
import { initNavigation } from '../../app.js';
import './SliderView.scss';

const createSlideContent = (text) => createElement('div', {
    props: { className: 'slide-content', textContent: text },
});

const initDefaultSlider = () => {
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
    const container = ge('defaultSlider');
    container.append(slider.elem);

    setEvents(ge('slideToStartBtn'), { click: () => slider.slideTo(0) });
    setEvents(ge('slidePrevBtn'), { click: () => slider.slideToPrev() });
    setEvents(ge('slideNextBtn'), { click: () => slider.slideToNext() });
    setEvents(ge('switchToStartBtn'), { click: () => slider.switchTo(0) });
};

const initVerticalSlider = () => {
    const slider = new Slider({
        width: 300,
        height: 200,
        vertical: true,
    });
    const container = ge('verticalSlider');
    container.append(slider.elem);

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

    setEvents(ge('vSlideToStartBtn'), { click: () => slider.slideTo(0) });
    setEvents(ge('vSlidePrevBtn'), { click: () => slider.slideToPrev() });
    setEvents(ge('vSlideNextBtn'), { click: () => slider.slideToNext() });
    setEvents(ge('vSwitchToStartBtn'), { click: () => slider.switchTo(0) });
};

const initMouseSlider = () => {
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
    const container = ge('mouseSlider');
    container.append(slider.elem);
};

const initNoTouchSlider = () => {
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
    const container = ge('noTouchSlider');
    container.append(slider.elem);

    setEvents(ge('noTouchPrevBtn'), { click: () => slider.slideToPrev() });
    setEvents(ge('noTouchNextBtn'), { click: () => slider.slideToNext() });
};

const initNoWheelSlider = () => {
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
    const container = ge('noWheelSlider');
    container.append(slider.elem);
};

const init = () => {
    initNavigation();

    initDefaultSlider();
    initVerticalSlider();
    initMouseSlider();
    initNoTouchSlider();
    initNoWheelSlider();
};

onReady(init);
