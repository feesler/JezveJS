import 'jezvejs/style';
import { ge } from 'jezvejs';
import { Button } from 'jezvejs/Button';
import { Input } from 'jezvejs/Input';

import { DemoView } from '../../Application/DemoView.js';
import './InputView.scss';

const addEventLog = (value) => {
    const logElem = ge('eventsLog');
    logElem.value += `${value}\r\n`;
};

const initDefault = () => {
    Input.fromElement(ge('defaultInput'), {
        onFocus: () => addEventLog('onFocus'),
        onBlur: () => addEventLog('onBlur'),
        onInput: () => addEventLog('onInput'),
        onChange: () => addEventLog('onChange'),
    });
};

const initPlaceholder = () => {
    const input = Input.create({
        placeholder: 'Input value',
    });
    ge('placeholderContainer').append(input.elem);
};

const initFullWidth = () => {
    const input = Input.create({
        className: 'full-width',
    });
    ge('fullwidthContainer').append(input.elem);
};

const initStyled = () => {
    const input = Input.create({
        className: 'styled',
        placeholder: 'Input correct value',
    });
    ge('styledContainer').append(input.elem);
};

const initDisabled = () => {
    const disabledInp = Input.create({
        value: 'Disabled input',
        disabled: true,
    });

    ge('disabledContainer').append(disabledInp.elem);

    const toggleEnableBtn = Button.fromElement(ge('toggleEnableBtn'), {
        onClick: () => {
            const { disabled } = disabledInp;
            toggleEnableBtn.setTitle((disabled) ? 'Disable' : 'Enable');
            disabledInp.enable(disabled);
        },
    });
};

class InputView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initTableOfContents();
        this.addTableOfContentsItem({ title: 'Default settings', url: 'default' });
        this.addTableOfContentsItem({ title: 'Placeholder', url: 'placeholder' });
        this.addTableOfContentsItem({ title: 'Full width', url: 'fullwidth' });
        this.addTableOfContentsItem({ title: 'Disabled component', url: 'disabled' });

        initDefault();
        initPlaceholder();
        initFullWidth();
        initStyled();
        initDisabled();
    }
}

InputView.create();
