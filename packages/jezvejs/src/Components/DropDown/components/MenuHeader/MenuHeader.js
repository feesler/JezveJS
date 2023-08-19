import { Component } from '../../../../js/Component.js';
import { getSelectedItems } from '../../utils.js';

import './MenuHeader.scss';

const defaultProps = {
    inputString: '',
    inputElem: null,
    inputPlaceholder: null,
    useSingleSelectionAsPlaceholder: true,
    multiple: false,
    components: {
        Input: null,
    },
};

/**
 * Custom Menu header with Input component
 */
export class DropDownMenuHeader extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });

        this.state = {
            inputString: this.props.inputString,
            inputPlaceholder: this.props.inputPlaceholder,
        };

        this.init();
        this.render(this.state);
    }

    init() {
        const { Input } = this.props.components;
        if (!Input) {
            throw new Error('Invalid Input component');
        }

        this.input = Input.create({
            elem: this.props.inputElem,
            placeholder: this.props.inputPlaceholder,
            onInput: (e) => this.onInput(e),
        });

        this.elem = this.input.elem;
    }

    render(state) {
        if (!state) {
            throw new Error('Invalid state');
        }

        let placeholder = state.inputPlaceholder;
        if (!this.props.multiple) {
            const [item] = getSelectedItems(state);
            const str = item?.title ?? '';
            const usePlaceholder = (
                !this.props.useSingleSelectionAsPlaceholder
                && placeholder?.length > 0
            );
            placeholder = (usePlaceholder) ? state.inputPlaceholder : str;
        }

        this.input.setState((inputState) => ({
            ...inputState,
            placeholder,
            value: state.inputString,
        }));
    }
}
