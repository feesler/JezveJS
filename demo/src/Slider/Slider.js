import 'jezvejs/style';
import {
    createElement,
    ge,
    onReady,
} from 'jezvejs';
import { Slider } from 'jezvejs/Slider';
import '../common/app.scss';
import './style.scss';
import { initNavigation } from '../common/app.js';

const createSlideContent = (text) => createElement('div', {
    props: { className: 'slide-content', textContent: text },
});

const initDefaultSlider = () => {
    const slider = new Slider();
    slider.init({
        id: 'defaultSlider',
        width: 300,
        height: 200,
    });

    slider.addSlide('slide-1');
    ge('slide-1').append(createSlideContent('Slide 1'));
    slider.addSlide('slide-2');
    ge('slide-2').append(createSlideContent('Slide 2'));
    slider.addSlide('slide-3');
    ge('slide-3').append(createSlideContent('Slide 3'));

    const slideToStartBtn = ge('slideToStartBtn');
    slideToStartBtn.addEventListener('click', () => slider.slideTo(0));
    const slideLeftBtn = ge('slideLeftBtn');
    slideLeftBtn.addEventListener('click', () => slider.slide(true));
    const slideRightBtn = ge('slideRightBtn');
    slideRightBtn.addEventListener('click', () => slider.slide(false));
};

const init = () => {
    initNavigation();

    initDefaultSlider();
};

onReady(init);
