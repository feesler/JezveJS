import 'jezvejs/style';
import 'jezvejs/style/Button';
import 'jezvejs/style/Input';
import {
    ge,
    createElement,
    onReady,
} from 'jezvejs';
import { InputGroup } from 'jezvejs/InputGroup';
import { initNavigation } from '../../app.js';
import './InputGroupView.scss';

const initParsed = () => {
    const allInputs = Array.from(document.querySelectorAll('.input-group'));
    allInputs.forEach((elem) => InputGroup.fromElement(elem));
};

const initDynamic = () => {
    const container = ge('dynContainer');

    const input = createElement('input', {
        props: {
            className: 'input input-group__input stretch-input',
            type: 'text',
        },
    });
    const text = createElement('div', {
        props: {
            className: 'input-group__text',
            textContent: '$',
        },
    });
    const inputGroup = InputGroup.create({
        children: [input, text],
    });

    container.append(inputGroup.elem);
};

const init = () => {
    initNavigation();

    initParsed();
    initDynamic();
};

onReady(init);
