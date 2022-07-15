import {
    ge,
    getRealDPI,
    onReady,
} from '../../js/index.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import './dpitest.css';

function init() {
    const realDPI = getRealDPI();
    const testpic = ge('testpic');

    testpic.classList.add((realDPI > 1) ? 'pic-double' : 'pic-single');
    ge('status').textContent = `Real DPI: ${realDPI}`;
}

onReady(init);
