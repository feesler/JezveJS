import { onReady } from '../../js/common.js';
import { Debug } from '../../Components/Debug/Debug.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';

function init() {
    const debug = new Debug();

    debug.create();
    for (let i = 1; i <= 100; i += 1) {
        debug.log(`Test message ${i}`);
    }

    debug.addControl('Check', () => { alert('Custom control check'); });
}

onReady(init);
