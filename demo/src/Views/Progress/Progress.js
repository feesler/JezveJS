import 'jezvejs/style';
import { ge, onReady } from 'jezvejs';
import { Progress } from 'jezvejs/Progress';
import { IndetermProgress } from 'jezvejs/IndetermProgress';
import { Spinner } from 'jezvejs/Spinner';
import { initNavigation } from '../../app.js';
import './style.scss';

const initDefaultProgress = () => {
    const section = ge('defaultProgress');

    const defProgress = Progress.create({ className: 'w-500' });
    const defProgress50 = Progress.create({ className: 'w-500', value: 50 });
    const defProgress100 = Progress.create({ className: 'w-500', value: 100 });

    section.append(defProgress.elem, defProgress50.elem, defProgress100.elem);

    const set0Btn = ge('set0Btn');
    set0Btn.addEventListener('click', () => defProgress.setProgress(0));
    const set50Btn = ge('set50Btn');
    set50Btn.addEventListener('click', () => defProgress.setProgress(50));
    const set100Btn = ge('set100Btn');
    set100Btn.addEventListener('click', () => defProgress.setProgress(100));
};

const initStyledProgress = () => {
    const container = ge('styledProgress');

    const thinGreenProgress = Progress.create({
        className: 'w-500 green-progress thin-progress',
        value: 25,
    });
    const thickSquareProgress = Progress.create({
        className: 'w-500 thick-progress square-progress',
        value: 50,
    });
    const borderProgress = Progress.create({
        className: 'w-500 border-progress',
        value: 75,
    });

    container.append(thinGreenProgress.elem, thickSquareProgress.elem, borderProgress.elem);
};

const initIndetermProgress = () => {
    const container1 = ge('prwrap');
    const pr = IndetermProgress.create({ run: false });
    container1.append(pr.elem);

    const container2 = ge('prwrap2');
    const pr2 = IndetermProgress.create({ className: 'pb-style' });
    container2.append(pr2.elem);

    const container3 = ge('prwrap3');
    const pr3 = IndetermProgress.create({ circles: 3, className: 'circles-style' });
    container3.append(pr3.elem);

    const toggleBtn = ge('toggleBtn');
    toggleBtn.addEventListener('click', () => {
        if (pr.running) {
            toggleBtn.textContent = 'Start';
            pr.stop();
        } else {
            toggleBtn.textContent = 'Stop';
            pr.start();
        }
    });

    setTimeout(() => {
        toggleBtn.textContent = 'Stop';
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
    initNavigation();

    initDefaultProgress();
    initStyledProgress();

    initIndetermProgress();

    initSpinner();
};

onReady(init);