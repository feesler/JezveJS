import 'jezvejs/style';
import 'jezvejs/style/Button';
import 'jezvejs/style/Input';
import { ge, createElement } from 'jezvejs';
import { InputGroup } from 'jezvejs/InputGroup';

import { DemoView } from '../../Application/DemoView.js';
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

class InputGroupView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.addContentsMenuItem({ title: 'Input group with text', url: 'text' });
        this.addContentsMenuItem({ title: 'Input group with button', url: 'button' });
        this.addContentsMenuItem({ title: 'Multiple inputs', url: 'multipleInputs' });
        this.addContentsMenuItem({ title: 'Inner buttons', url: 'innerButton' });
        this.addContentsMenuItem({ title: 'Input outer container', url: 'outerContainer' });
        this.addContentsMenuItem({ title: 'Disabled', url: 'disabled' });
        this.addContentsMenuItem({ title: 'Create', url: 'create' });

        initParsed();
        initDynamic();
    }
}

InputGroupView.create();
