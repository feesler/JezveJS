import 'jezvejs/style';
import { DemoView } from '../../Components/DemoView/DemoView.js';
import './TestsView.scss';

/**
 * Tests view
 */
class TestsView extends DemoView {
    /**
     * View initialization
     */
    onStart() {
        this.setMainHeading('Tests');

        this.container.id = 'testscontainer';
    }
}

TestsView.create();
