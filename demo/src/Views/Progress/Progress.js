import 'jezvejs/style';
import { Button } from 'jezvejs/Button';
import { Progress } from 'jezvejs/Progress';
import { IndetermProgress } from 'jezvejs/IndetermProgress';
import { Spinner } from 'jezvejs/Spinner';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import { createButtons, createContainer, createControls } from '../../Application/utils.js';
import './ProgressView.scss';

/**
 * Progress, IndetermProgress and Spinner components demo view
 */
class ProgressView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('Progress and Spinner');

        this.addSectionsGroup({ title: 'Progress' });

        this.initDefaultProgress();
        this.initStyledProgress();

        this.addSectionsGroup({ title: 'IndetermProgress' });
        this.initIndetermProgress();

        this.addSectionsGroup({ title: 'Spinner' });
        this.initSpinner();
    }

    initDefaultProgress() {
        const defProgress = Progress.create({ className: 'w-500' });
        const defProgress50 = Progress.create({ className: 'w-500', value: 50 });
        const defProgress100 = Progress.create({ className: 'w-500', value: 100 });

        this.addSection({
            id: 'progressDefault',
            title: 'Default settings',
            content: [
                createContainer('defaultProgress', [
                    defProgress.elem,
                    defProgress50.elem,
                    defProgress100.elem,
                ]),
                createButtons([{
                    id: 'set0Btn',
                    className: 'action-btn',
                    title: '0%',
                    onClick: () => defProgress.setProgress(0),
                }, {
                    id: 'set50Btn',
                    className: 'action-btn',
                    title: '50%',
                    onClick: () => defProgress.setProgress(50),
                }, {
                    id: 'set100Btn',
                    className: 'action-btn',
                    title: '100%',
                    onClick: () => defProgress.setProgress(100),
                }]),
            ],
        });
    }

    initStyledProgress() {
        this.addSection({
            id: 'progressStyled',
            title: 'Styled',
            content: [
                Progress.create({
                    className: 'w-500 green-progress thin-progress',
                    value: 25,
                }).elem,
                Progress.create({
                    className: 'w-500 thick-progress square-progress',
                    value: 50,
                }).elem,
                Progress.create({
                    className: 'w-500 border-progress',
                    value: 75,
                }).elem,
            ],
        });
    }

    initIndetermProgress() {
        const pr = IndetermProgress.create({ run: false });

        const toggleBtn = Button.create({
            id: 'toggleBtn',
            title: 'Start',
            onClick: () => {
                if (pr.running) {
                    toggleBtn.setTitle('Start');
                    pr.stop();
                } else {
                    toggleBtn.setTitle('Stop');
                    pr.start();
                }
            },
        });

        this.addSection({
            id: 'indeterm300',
            title: '300px width, 3 sec',
            content: [
                pr.elem,
                createControls(toggleBtn.elem),
            ],
        });

        const pr2 = IndetermProgress.create({ className: 'pb-style' });

        this.addSection({
            id: 'indeterm600',
            title: '600px width, 5 sec',
            content: pr2.elem,
        });

        const pr3 = IndetermProgress.create({ circlesCount: 3, className: 'circles-style' });

        this.addSection({
            id: 'indetermStyled',
            title: 'Styled',
            content: pr3.elem,
        });

        setTimeout(() => {
            toggleBtn.setTitle('Stop');
            pr.start();
            pr2.start();
            pr3.start();
        }, 1000);
    }

    initSpinner() {
        this.addSection({
            id: 'spinnerDefault',
            title: 'Default settings',
            content: createContainer('spinnerContainer', Spinner.create().elem),
        });
    }
}

ProgressView.create();
