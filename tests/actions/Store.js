import { test } from 'jezve-test';
import { assert } from '@jezvejs/assert';
import { createSlice, createStore } from '../../packages/jezvejs/src/Components/Store/Store.js';

/** Runs tests for createStore(), subscribe and dispatch action */
export const createStoreTest = async () => {
    await test('createStore() function', async () => {
        const initialState = { a: 1, b: 2 };
        const expectedState = { a: 1, b: 3 };
        const testAction = { type: 'testAction', payload: 3 };
        let isInitialState = true;

        const storePromise = new Promise((resolve) => {
            const reducer = (state, action) => {
                assert.exactMeet(state, initialState);
                assert.exactMeet(action, testAction);

                return { ...state, b: action.payload };
            };

            const store = createStore(reducer, { initialState });

            store.subscribe((state, prevState) => {
                if (isInitialState) {
                    assert.exactMeet(state, initialState);
                    assert.exactMeet(prevState, {});

                    isInitialState = false;
                    return;
                }

                assert.exactMeet(state, expectedState);
                assert.exactMeet(prevState, initialState);

                resolve(true);
            });

            store.dispatch(testAction);
        });

        return storePromise;
    });
};

/** Runs tests for createSlice(), subscribe and dispatch action */
export const createSliceTest = async () => {
    await test('createSlice() function', async () => {
        const testActionValue = { b: 3 };
        const initialState = { a: 1, b: 2 };
        const expectedState = { a: 1, b: 3 };
        let isInitialState = true;

        const storePromise = new Promise((resolve) => {
            const slice = createSlice({
                testAction: (state, value) => {
                    assert.exactMeet(state, initialState);
                    assert.exactMeet(value, testActionValue);

                    return { ...state, ...value };
                },
            });

            const { actions, reducer } = slice;

            const store = createStore(reducer, { initialState });

            store.subscribe((state, prevState) => {
                if (isInitialState) {
                    assert.exactMeet(state, initialState);
                    assert.exactMeet(prevState, {});

                    isInitialState = false;
                    return;
                }

                assert.exactMeet(state, expectedState);
                assert.exactMeet(prevState, initialState);

                resolve(true);
            });

            store.dispatch(actions.testAction(testActionValue));
        });

        return storePromise;
    });
};
