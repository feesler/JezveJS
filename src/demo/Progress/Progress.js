import { ge, onReady } from '../../js/index.js';
import { Progress } from '../../Components/Progress/Progress.js';
import { Spinner } from '../../Components/Spinner/Spinner.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';
import './progress.css';

const initProgress = () => {
    const toggle1 = ge('toggle1');
    if (!toggle1) {
        return;
    }

    const pr = Progress.create({ wrapper_id: 'prwrap' });
    const pr2 = Progress.create({ wrapper_id: 'prwrap2', additional: 'pb-style' });
    const pr3 = Progress.create({ wrapper_id: 'prwrap3', circles: 3, additional: 'circles-style' });

    toggle1.onclick = () => {
        if (pr.running()) {
            toggle1.value = 'Start';
            pr.stop();
        } else {
            toggle1.value = 'Stop';
            pr.start();
        }
    };

    setTimeout(() => {
        toggle1.value = 'Stop';
        pr.start();
        pr2.start();
        pr3.start();
    }, 1000);
};

const initSpinner = () => {
    const spinner = Spinner.create();
    ge('spinnerContainer').append(spinner.elem);
};

const init = () => {
    initProgress();
    initSpinner();
};

onReady(init);
