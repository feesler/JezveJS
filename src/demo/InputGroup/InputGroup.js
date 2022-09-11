import {
    ge,
    ce,
    onReady,
    InputGroup,
} from '../../js/index.js';
import { initNavigation } from '../common/app.js';
import '../../css/common.scss';
import '../common/app.scss';
import './style.scss';

const initParsed = () => {
    const allInputs = Array.from(document.querySelectorAll('.input-group'));
    allInputs.forEach((elem) => InputGroup.fromElement(elem));
};

const initDynamic = () => {
    const container = ge('dynContainer');

    const input = ce('input', {
        className: 'input-group__input stretch-input',
        type: 'text',
    });
    const text = ce('div', {
        className: 'input-group__text',
        textContent: '$',
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
