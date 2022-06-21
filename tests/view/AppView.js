import { TestView, navigation, click } from 'jezve-test';

export class AppView extends TestView {
    isUserLoggedIn() {
        const loggedOutLocations = ['login', 'register'];

        return loggedOutLocations.every((item) => !this.location.includes(`/${item}`));
    }

    async closeNotification() {
        if (!this.content.msgPopup) {
            return;
        }

        await this.performAction(() => this.content.msgPopup.close());
    }

    async goToMainView() {
        await navigation(() => click(this.content.header.content.logo.linkElem));
    }
}
