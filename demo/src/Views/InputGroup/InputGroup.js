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
        this.initTableOfContents();
        this.addTableOfContentsItem({ title: 'Input group with text', url: 'text' });
        this.addTableOfContentsItem({ title: 'Input group with button', url: 'button' });
        this.addTableOfContentsItem({ title: 'Multiple inputs', url: 'multipleInputs' });
        this.addTableOfContentsItem({ title: 'Inner buttons', url: 'innerButton' });
        this.addTableOfContentsItem({ title: 'Input outer container', url: 'outerContainer' });
        this.addTableOfContentsItem({ title: 'Disabled', url: 'disabled' });
        this.addTableOfContentsItem({ title: 'Create', url: 'create' });

        initParsed();
        initDynamic();
    }
}

InputGroupView.create();
