import 'jezvejs/style';
import { ge, onReady } from 'jezvejs';
import { DateInput } from 'jezvejs/DateInput';
import { initNavigation } from '../../app.js';

function init() {
    initNavigation();

    DateInput.create({ elem: ge('dateinput') });
}

onReady(init);
