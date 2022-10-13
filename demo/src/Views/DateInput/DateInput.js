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

const initPlaceholder = () => {
    DateInput.create({ elem: ge('dateInputPh'), placeholder: 'Input date' });
};

const initLocales = () => {
    DateInput.create({ elem: ge('usDateInput'), locales: ['en-US'] });
    DateInput.create({ elem: ge('koDateInput'), locales: ['ko-KR'] });
    DateInput.create({ elem: ge('ruDateInput'), locales: ['ru-RU'] });
};

const init = () => {
    initNavigation();

    initDefault();
    initPlaceholder();
    initLocales();
};

onReady(init);
