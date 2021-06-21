import { TestView } from 'jezve-test';

export class AppView extends TestView {
    isUserLoggedIn() {
        const loggedOutLocations = ['login', 'register'];

        return loggedOutLocations.every((item) => !this.location.includes(`/${item}`));
    }

    async closeNotification() {
        if (!this.msgPopup) {
            return;
        }

        await this.performAction(() => this.msgPopup.close());
    }

    async goToMainView() {
        await this.navigation(() => this.click(this.header.logo.linkElem));
    }
}
