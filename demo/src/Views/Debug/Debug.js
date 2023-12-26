import 'jezvejs/style';
import { Debug } from 'jezvejs/Debug';

import { DemoView } from '../../Components/DemoView/DemoView.js';

/**
 * Debug component demo view
 */
class DebugView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('Debug');

        const debug = Debug.create();

        for (let i = 1; i <= 100; i += 1) {
            debug.log(`Test message ${i}`);
        }

        debug.addControl('Check', () => { alert('Custom control check'); });
    }
}

DebugView.create();
