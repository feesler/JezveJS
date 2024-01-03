import 'jezvejs/style';
import { createElement, getClassName, getRealDPI } from '@jezvejs/dom';

import { DemoView } from '../../Components/DemoView/DemoView.js';
import './DpiTestView.scss';

/**
 * getRealDPI() function demo view
 */
class DpiTestView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('DPI test');

        this.initDefault();
    }

    initDefault() {
        const realDPI = getRealDPI();

        this.addSection({
            id: 'default',
            title: 'Default settings',
            content: [
                createElement('div', {
                    id: 'testpic',
                    className: getClassName(
                        'pic',
                        (realDPI > 1) ? 'pic-double' : 'pic-single',
                    ),
                }),
                createElement('div', {
                    id: 'status',
                    textContent: `Real DPI: ${realDPI}`,
                }),
            ],
        });
    }
}

DpiTestView.create();
