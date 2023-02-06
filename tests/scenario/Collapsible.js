import { setBlock } from 'jezve-test';
import * as Actions from '../run/Collapsible.js';

export const collapsibleTests = async () => {
    setBlock('Collapsible component', 1);

    setBlock('Toggle by click', 2);
    await Actions.toggle('simple');
    await Actions.toggle('simple');
    await Actions.toggle('styled');
    await Actions.toggle('custom');
    await Actions.toggle('custom');
    await Actions.toggle('disabledToggle');
    await Actions.toggle('disabledToggle');

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
