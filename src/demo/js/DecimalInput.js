import { ge, onReady } from '../../js/common.js';
import { DecimalInput } from '../../Components/DecimalInput/DecimalInput.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';

function init() {
    DecimalInput.create({ elem: ge('decinput') });
}

onReady(init);
