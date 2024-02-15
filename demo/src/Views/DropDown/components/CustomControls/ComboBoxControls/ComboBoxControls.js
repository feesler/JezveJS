import {
    DropDownComboBoxControls,
    DropDownClearButton,
    DropDownToggleButton,
} from 'jezvejs/DropDown';
import { MenuButton } from 'jezvejs/MenuButton';
import { Spinner } from 'jezvejs/Spinner';

/** CSS classes */
const LOADING_CLASS = 'dd__combo-loading';

const defaultProps = {
    loading: false,
    components: {
        Loading: Spinner,
        ComboMenuButton: MenuButton,
        ToggleButton: DropDownToggleButton,
        ClearButton: DropDownClearButton,
    },
};

/**
 * Custom combo box controls container
 */
export class CustomComboBoxControls extends DropDownComboBoxControls {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });
    }

    init() {
        super.init();

        const { Loading, ComboMenuButton } = this.props.components;

        this.menuBtn = ComboMenuButton.create();
        this.elem.prepend(this.menuBtn.elem);

        this.loadingIndicator = Loading.create({
            className: LOADING_CLASS,
        });
        this.loadingIndicator.hide();

        this.elem.prepend(this.loadingIndicator.elem);
    }

    renderLoading(state, prevState) {
        if (state.loading === prevState.loading) {
            return;
        }

        this.loadingIndicator.show(!!state.loading);
    }

    render(state, prevState = {}) {
        super.render(state, prevState);

        this.renderLoading(state, prevState);
    }
}
