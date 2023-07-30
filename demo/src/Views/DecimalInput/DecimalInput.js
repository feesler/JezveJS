import 'jezvejs/style';
import 'jezvejs/style/Button';
import 'jezvejs/style/Input';
import { ge, setEvents } from 'jezvejs';
import { DecimalInput } from 'jezvejs/DecimalInput';

import { DemoView } from '../../Application/DemoView.js';

const onSubmitForm = (e) => {
    e.preventDefault();

    ge('formStatus').textContent = 'Form submit event fired';
};

const initDefault = () => {
    setEvents(ge('decForm'), { submit: (e) => onSubmitForm(e) });

    DecimalInput.create({ elem: ge('decInput') });
};

const initDigitsLimit = () => {
    const dd = DecimalInput.create({
        elem: ge('decInputDigits'),
        digits: 3,
    });

    dd.value = 2;
};

const initInteger = () => {
    DecimalInput.create({
        elem: ge('decInputInteger'),
        digits: 0,
    });
};

const initChangeProps = () => {
    const dinput = DecimalInput.create({
        elem: ge('decInputChange'),
        digits: 2,
    });

    setEvents(ge('changeDigitsBtn'), {
        click: () => {
            dinput.setState((state) => ({
                ...state,
                digits: (state.digits === 2) ? 3 : 2,
            }));
        },
    });
};

const initOnlyPositive = () => {
    DecimalInput.create({
        elem: ge('decInputPositive'),
        allowNegative: false,
    });
};

const initLeadingZeros = () => {
    DecimalInput.create({
        elem: ge('decInputZeros'),
        allowMultipleLeadingZeros: true,
    });
};

const initCreate = () => {
    const decInput = DecimalInput.create({
        className: 'input',
    });
    const container = ge('createContainer');
    container.append(decInput.elem);
};

class DecimalInputView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.initTableOfContents();
        this.addTableOfContentsItem({ title: 'Default settings', url: 'default' });
        this.addTableOfContentsItem({ title: 'Limit digits', url: 'limit' });
        this.addTableOfContentsItem({ title: 'Integer', url: 'integer' });
        this.addTableOfContentsItem({ title: 'Change digits after decimal point value', url: 'changeProps' });
        this.addTableOfContentsItem({ title: 'Disable negative values', url: 'positive' });
        this.addTableOfContentsItem({ title: 'Multiple leading zeros', url: 'leadzero' });
        this.addTableOfContentsItem({ title: 'Create input element', url: 'create' });

        initDefault();
        initDigitsLimit();
        initInteger();
        initChangeProps();
        initOnlyPositive();
        initLeadingZeros();
        initCreate();
    }
}

DecimalInputView.create();
