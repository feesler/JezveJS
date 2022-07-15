import { ge, onReady } from '../../js/index.js';
import { DecimalInput } from '../../Components/DecimalInput/DecimalInput.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';

function init() {
    DecimalInput.create({ elem: ge('decinput') });
    const dd = DecimalInput.create({
        elem: ge('decinputdigits'),
        digits: 3,
    });

    dd.value = 2;
}

onReady(init);
