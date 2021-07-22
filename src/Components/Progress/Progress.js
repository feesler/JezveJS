import { ge, ce, isInt } from '../../js/common.js';
import '../../css/common.css';
import './progress.css';

/** Progress constructor */
export const Progress = new (function () {
    /** Indeterminate progress instance constructor */
    function IndetermProgress(params) {
        let wrapperObj = null;
        let progressObj = null;
        let progressCont = null;
        const defCirclesCount = 5;
        let circlesCount = null;

        /** Start progress animation */
        function startProgress() {
            progressCont.classList.add('run');
        }

        /** Stop progress animation */
        function stopProgress() {
            progressCont.classList.remove('run');
        }

        /** Return progress animation running status */
        function isRunning() {
            return progressCont.classList.contains('run');
        }

        /** Transation end event handler */
        function onTransitionEnd(e) {
            if (!progressCont) {
                return;
            }

            if (e.propertyName === 'transform' && isRunning()) {
                stopProgress();
                setTimeout(startProgress, 100);
            }
        }

        /** Progress instance */
        function create(props = {}) {
            if (props.wrapper_id) {
                wrapperObj = ge(props.wrapper_id);
                if (!wrapperObj) {
                    return;
                }
            }

            circlesCount = isInt(props.circles) ? props.circles : defCirclesCount;

            progressCont = ce('div', { className: 'progress-container' });

            let circle;
            for (let i = 0; i < circlesCount; i += 1) {
                circle = ce('div', { className: 'progress-circle' });
                progressCont.appendChild(circle);
            }

            circle.addEventListener('webkitTransitionEnd', onTransitionEnd);
            circle.addEventListener('transitionend', onTransitionEnd);

            const opacityObj = ce('div', { className: 'progress-opacity' });

            progressObj = ce(
                'div',
                { className: 'progress-bar' },
                [progressCont, opacityObj],
            );

            if (props.additional) {
                progressObj.classList.add(props.additional);
            }

            wrapperObj.appendChild(progressObj);
        }

        create(params);

        /* public methods of progress instance */

        this.stop = function () {
            stopProgress();
        };

        this.start = function () {
            startProgress();
        };

        this.running = function () {
            return isRunning();
        };
    }

    /** Progress global object public methods */
    this.create = function (params) {
        try {
            return new IndetermProgress(params);
        } catch (e) {
            return null;
        }
    };
})();
