import 'jezvejs/style';
import { Debug } from 'jezvejs/Debug';

import { DemoView } from '../../Application/DemoView.js';

class DebugView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        const debug = Debug.create();

        for (let i = 1; i <= 100; i += 1) {
            debug.log(`Test message ${i}`);
        }

        debug.addControl('Check', () => { alert('Custom control check'); });
    }
}

DebugView.create();
