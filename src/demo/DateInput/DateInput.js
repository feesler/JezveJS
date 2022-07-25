import { ge, onReady, DateInput } from '../../js/index.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';

function init() {
    DateInput.create({ elem: ge('dateinput') });
}

onReady(init);
