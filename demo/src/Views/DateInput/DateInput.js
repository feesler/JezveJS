import 'jezvejs/style';
import 'jezvejs/style/Input';
import { ge, setEvents } from 'jezvejs';
import { DateInput } from 'jezvejs/DateInput';

import { DemoView } from '../../Application/DemoView.js';

const onInput = (e) => {
    ge('inputStatus').textContent = e.target.value;
};

const onSubmitForm = (e) => {
    e.preventDefault();

    ge('formStatus').textContent = 'Form submit event fired';
};

const initDefault = () => {
    setEvents(ge('dateForm'), { submit: (e) => onSubmitForm(e) });

    DateInput.create({
        elem: ge('dateinput'),
        onInput: (e) => onInput(e),
    });
};

const initPlaceholder = () => {
    DateInput.create({ elem: ge('dateInputPh'), placeholder: 'Input date' });
};

const initCreate = () => {
    const dateInput = DateInput.create({
        className: 'input',
        placeholder: 'Created input element',
    });
    const container = ge('createContainer');
    container.append(dateInput.elem);
};

const initLocales = () => {
    DateInput.create({ elem: ge('usDateInput'), locales: ['en-US'] });
    DateInput.create({ elem: ge('koDateInput'), locales: ['ko-KR'] });
    DateInput.create({ elem: ge('ruDateInput'), locales: ['ru-RU'] });
    DateInput.create({ elem: ge('esDateInput'), locales: ['es'] });
};

class DateInputView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        initDefault();
        initPlaceholder();
        initCreate();
        initLocales();
    }
}

DateInputView.create();
