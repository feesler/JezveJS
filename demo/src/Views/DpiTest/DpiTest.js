import 'jezvejs/style';
import {
    ge,
    getRealDPI,
    onReady,
} from 'jezvejs';
import { initNavigation } from '../../app.js';
import './DpiTestView.scss';

const init = () => {
    initNavigation();

    const realDPI = getRealDPI();
    const testpic = ge('testpic');

    testpic.classList.add((realDPI > 1) ? 'pic-double' : 'pic-single');
    ge('status').textContent = `Real DPI: ${realDPI}`;
};

onReady(init);
