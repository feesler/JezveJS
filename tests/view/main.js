import { AppView } from './AppView.js';

export class MainView extends AppView {
    async parseContent() {
        const res = {};

        const demoLinks = await this.queryAll('h2 a');
        if (!demoLinks) {
            throw new Error('Fail to parse main view');
        }

        for (const linkElem of demoLinks) {
            const href = await this.prop(linkElem, 'href');
            if (href.includes('dropdown')) {
                res.dropDownLink = linkElem;
            } else if (href.includes('datepicker')) {
                res.datePickerLink = linkElem;
            }
        }

        return res;
    }

    async goToDropDown() {
        return this.navigation(() => this.click(this.content.dropDownLink));
    }
}
