import 'jezvejs/style';
import { onReady } from 'jezvejs';
import { Debug } from 'jezvejs/Debug';
import { initNavigation } from '../../app.js';

const init = () => {
    initNavigation();

    const debug = Debug.create();

    for (let i = 1; i <= 100; i += 1) {
        debug.log(`Test message ${i}`);
    }

    debug.addControl('Check', () => { alert('Custom control check'); });
};

onReady(init);
