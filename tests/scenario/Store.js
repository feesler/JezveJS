import { setBlock } from 'jezve-test';
import * as Actions from '../run/Store.js';

export const storeTests = async () => {
    setBlock('Store', 1);

    await Actions.createStoreTest();
    await Actions.createSliceTest();
};
