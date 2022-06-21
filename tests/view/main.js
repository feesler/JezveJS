import {
    queryAll,
    prop,
    navigation,
    click,
} from 'jezve-test';
import { AppView } from './AppView.js';

export class MainView extends AppView {
    async parseContent() {
        const res = {};

        const demoLinks = await queryAll('h2 a');
        if (!demoLinks) {
            throw new Error('Fail to parse main view');
        }

        for (const linkElem of demoLinks) {
            const href = await prop(linkElem, 'href');
            if (href.includes('dropdown')) {
                res.dropDownLink = linkElem;
            } else if (href.includes('datepicker')) {
                res.datePickerLink = linkElem;
            }
        }

        return res;
    }

    async goToDropDown() {
        return navigation(() => click(this.content.dropDownLink));
    }
}
