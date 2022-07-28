import { ge, onReady, DateInput } from '../../js/index.js';
import '../../css/common.scss';
import '../css/common.scss';
import '../css/app.scss';

function init() {
    DateInput.create({ elem: ge('dateinput') });
}

onReady(init);
