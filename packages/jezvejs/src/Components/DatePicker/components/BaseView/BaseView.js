import { isDate } from '@jezvejs/types';
import { Component } from '../../../../Component.js';
import {
    getHeaderTitle,
    getNextViewDate,
    getPrevViewDate,
} from '../../utils.js';
import './BaseView.scss';

const defaultProps = {
    date: null,
    title: null,
    nav: null,
    locales: [],
};

/**
 * Base DatePicker view component
 */
export class DatePickerBaseView extends Component {
    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
            components: {
                ...defaultProps.components,
                ...(props?.components ?? {}),
            },
        });

        this.items = [];
        this.state = this.getInitialState(this.type);

        this.init();
        this.render(this.state);
    }

    get type() {
        throw new Error('Not implemented');
    }

    get date() {
        return this.state.date;
    }

    get title() {
        return this.state.title;
    }

    get nav() {
        return this.state.nav;
    }

    getInitialState(viewType) {
        const { date, locales } = this.props;
        if (!isDate(date)) {
            throw new Error('Invalid date');
        }

        return {
            ...this.props,
            title: getHeaderTitle({
                viewType,
                date,
                locales,
            }),
            nav: {
                prev: getPrevViewDate(date, viewType),
                next: getNextViewDate(date, viewType),
            },
        };
    }

    createHeader() {
        const { Header } = this.props.components;
        if (this.props.renderHeader && Header) {
            this.header = Header.create({
                ...(this.props.header ?? {}),
                title: this.state.title,
            });
            this.elem.append(this.header.elem);
        }
    }
}
