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

        this.asyncOptions = {
            dispatch: (action) => this.dispatch(action),
            getState: () => this.getState(),
        };
    }

    getState() {
        return this.state;
    }

    dispatch(action) {
        if (isFunction(action)) {
            action(this.asyncOptions);
            return;
        }

        const newState = this.reducer(this.state, action);
        const prevState = this.state;
        this.state = newState;
        this.listeners.forEach((listener) => listener(newState, prevState));
    }

    setState(state) {
        const newState = isFunction(state) ? state(this.state) : state;
        if (this.state === newState) {
            return;
        }

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
                return state;
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

export const combineReducers = (...reducers) => (
    (state, action) => {
        for (let i = 0; i < reducers.length; i += 1) {
            const reducer = reducers[i];
            const res = reducer(state, action);
            if (res !== state) {
                return res;
            }
        }

        return state;
    }
);
