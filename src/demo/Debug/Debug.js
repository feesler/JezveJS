import { onReady, Debug } from '../../js/index.js';
import '../../css/common.scss';
import '../common/app.scss';
import { initNavigation } from '../common/app.js';

function init() {
    initNavigation();

    const debug = new Debug();

    debug.create();
    for (let i = 1; i <= 100; i += 1) {
        debug.log(`Test message ${i}`);
    }

    debug.addControl('Check', () => { alert('Custom control check'); });
}

onReady(init);
