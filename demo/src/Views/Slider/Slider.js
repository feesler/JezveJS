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
import './style.scss';

const createSlideContent = (text) => createElement('div', {
    props: { className: 'slide-content', textContent: text },
});

const initDefaultSlider = () => {
    const slider = new Slider({
        width: 300,
        height: 200,
    });
    const container = ge('defaultSlider');
    container.append(slider.elem);

    slider.addSlide('slide-1');
    ge('slide-1').append(createSlideContent('Slide 1'));
    slider.addSlide('slide-2');
    ge('slide-2').append(createSlideContent('Slide 2'));
    slider.addSlide('slide-3');
    ge('slide-3').append(createSlideContent('Slide 3'));

    setEvents(ge('slideToStartBtn'), { click: () => slider.slideTo(0) });
    setEvents(ge('slidePrevBtn'), { click: () => slider.slide(true) });
    setEvents(ge('slideNextBtn'), { click: () => slider.slide(false) });
};

const initVerticalSlider = () => {
    const slider = new Slider({
        width: 300,
        height: 200,
        vertical: true,
    });
    const container = ge('verticalSlider');
    container.append(slider.elem);

    slider.addSlide('vslide-1');
    ge('vslide-1').append(createSlideContent('Slide 1'));
    slider.addSlide('vslide-2');
    ge('vslide-2').append(createSlideContent('Slide 2'));
    slider.addSlide('vslide-3');
    ge('vslide-3').append(createSlideContent('Slide 3'));

    setEvents(ge('vSlideToStartBtn'), { click: () => slider.slideTo(0) });
    setEvents(ge('vSlidePrevBtn'), { click: () => slider.slide(true) });
    setEvents(ge('vSlideNextBtn'), { click: () => slider.slide(false) });
};

const init = () => {
    initNavigation();

    initDefaultSlider();
    initVerticalSlider();
};

onReady(init);
