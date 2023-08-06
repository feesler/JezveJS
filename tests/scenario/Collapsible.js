import { setBlock } from 'jezve-test';
import * as Actions from '../actions/Collapsible.js';

export const collapsibleTests = async () => {
    setBlock('Collapsible component', 1);

    setBlock('Toggle by click', 2);
    await Actions.toggle('default');
    await Actions.toggle('default');
    await Actions.toggle('styled');
    await Actions.toggle('customHeader');
    await Actions.toggle('customHeader');
    await Actions.toggle('toggleOnClick');
    await Actions.toggle('toggleOnClick');

    setBlock('Disabled \'toggleOnClick\'', 2);
    await Actions.toggleDisabled();
    await Actions.toggleDisabled();

    setBlock('Methods', 2);
    await Actions.expandMethod();
    await Actions.expandMethod();
    await Actions.collapseMethod();
    await Actions.collapseMethod();
    await Actions.toggleMethod();
    await Actions.toggleMethod();
};
