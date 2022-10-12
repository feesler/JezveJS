import 'jezvejs/style';
import { ge, onReady, setEvents } from 'jezvejs';
import { DateInput } from 'jezvejs/DateInput';
import { initNavigation } from '../../app.js';

const onSubmitForm = (e) => {
    e.preventDefault();

    ge('formStatus').textContent = 'Form submit event fired';
};

const initDefault = () => {
    setEvents(ge('dateForm'), { submit: (e) => onSubmitForm(e) });

    DateInput.create({ elem: ge('dateinput') });
};

const init = () => {
    initNavigation();
    initDefault();
};

onReady(init);
