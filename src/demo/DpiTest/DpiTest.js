import {
    ge,
    getRealDPI,
    onReady,
} from '../../js/index.js';
import '../../css/common.scss';
import '../css/app.scss';
import './style.scss';

function init() {
    const realDPI = getRealDPI();
    const testpic = ge('testpic');

    testpic.classList.add((realDPI > 1) ? 'pic-double' : 'pic-single');
    ge('status').textContent = `Real DPI: ${realDPI}`;
}

onReady(init);
