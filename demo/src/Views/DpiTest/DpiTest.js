import 'jezvejs/style';
import { ge, getRealDPI } from 'jezvejs';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import './DpiTestView.scss';

class DpiTestView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        const realDPI = getRealDPI();
        const testpic = ge('testpic');

        testpic.classList.add((realDPI > 1) ? 'pic-double' : 'pic-single');
        ge('status').textContent = `Real DPI: ${realDPI}`;
    }
}

DpiTestView.create();
