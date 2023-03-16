import { isFunction, isObject } from '../../js/common.js';

/** State store class */
export class Store {
    constructor(reducer, options = {}) {
        if (!isFunction(reducer)) {
            throw new Error('Expected reducer to be a function');
        }

        const {
            initialState = {},
            sendInitialState = true,
        } = options;

        this.reducer = reducer;
        this.state = { ...initialState };
        this.listeners = [];
        this.sendInitialState = sendInitialState;
    }

    getState() {
        return this.state;
    }

    dispatch(action) {
        const newState = this.reducer(this.state, action);
        const prevState = this.state;
        this.state = newState;
        this.listeners.forEach((listener) => listener(newState, prevState));
    }

    subscribe(listener) {
        if (!isFunction(listener)) {
            throw new Error('Expected listener to be a function');
        }

        // Don't subscribe same listener twice
        if (this.listeners.some((l) => l === listener)) {
            return;
        }

        this.listeners.push(listener);

        // Send initial state to new listener
        if (this.sendInitialState) {
            listener(this.state, {});
        }
    }
}

export const createStore = (...args) => (new Store(...args));

export const createSlice = (reducers) => {
    if (!isObject(reducers)) {
        throw new Error('Invalid actions object');
    }

    const slice = {
        actions: {},
        reducers: {},
        reducer(state, action) {
            if (!(action.type in slice.reducers)) {
                throw new Error('Invalid action type');
            }

            const reduceFunc = slice.reducers[action.type];
            return reduceFunc(state, action.payload);
        },
    };

    Object.entries(reducers).forEach(([action, reducer]) => {
        slice.actions[action] = (payload) => ({ type: action, payload });
        slice.reducers[action] = reducer;
    });

    return slice;
};
