import 'jezvejs/style';
import 'jezvejs/style/Input';
import { ge, onReady, setEvents } from 'jezvejs';
import { DecimalInput } from 'jezvejs/DecimalInput';
import { initNavigation } from '../../app.js';

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

const init = () => {
    initNavigation();

    initDefault();
    initDigitsLimit();
    initInteger();
    initOnlyPositive();
    initLeadingZeros();
    initCreate();
};

onReady(init);
