import { View } from 'jezvejs/View';
import { initNavigation } from './app.js';

/**
 * Demo view base class
 */
export class DemoView extends View {
    /**
     * View pre initialization handler
     */
    preStart() {
        initNavigation();
    }
}
