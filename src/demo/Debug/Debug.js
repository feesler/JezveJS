import { onReady, Debug } from '../../js/index.js';
import '../../css/common.scss';
import '../css/app.scss';

function init() {
    const debug = new Debug();

    debug.create();
    for (let i = 1; i <= 100; i += 1) {
        debug.log(`Test message ${i}`);
    }

    debug.addControl('Check', () => { alert('Custom control check'); });
}

onReady(init);
