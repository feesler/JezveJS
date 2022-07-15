import { ge, onReady } from '../../js/index.js';
import { DateInput } from '../../Components/DateInput/DateInput.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';

function init() {
    DateInput.create({ elem: ge('dateinput') });
}

onReady(init);
