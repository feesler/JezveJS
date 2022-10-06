import { ge, onReady } from '../../js/index.js';
import { DateInput } from '../../Components/DateInput/DateInput.js';
import { initNavigation } from '../common/app.js';
import '../../css/common.scss';
import '../common/app.scss';

function init() {
    initNavigation();

    DateInput.create({ elem: ge('dateinput') });
}

onReady(init);
