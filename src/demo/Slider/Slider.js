import {
    ce,
    ge,
    onReady,
    Slider,
} from '../../js/index.js';
import '../../css/common.scss';
import '../css/app.scss';
import './style.scss';

const createSlideContent = (text) => (
    ce('div', { className: 'slide-content', textContent: text })
);

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
    initDefaultSlider();
};

onReady(init);
