import { ge, setEmptyClick, onReady } from '../../js/common.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import '../css/emptyclick.css';

let count = 0;

function init() {
    setEmptyClick(() => {
        count += 1;
        ge('status').innerHTML = `Empty clicks: ${count}<br>`;
    }, 'except');
}

onReady(init);
