import { addChilds, ce, isFunction, removeChilds } from '../../js/common.js';
import { Component } from '../../js/Component.js';
import './paginator.css';

const defaultProps = {
    breakLimit: 5,
    groupLimit: 3,
    pageNum: 0,
    pagesCount: 0,
    allowActiveLink: false,
    pageParam: 'page',
    url: window.location,
};

export class Paginator extends Component {
    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.init();
        this.render(this.state);
    }

    init() {
        this.state = {
            ...this.props,
        };

        this.elem = ce('div',
            { className: 'paginator' },
            null,
            { click: (e) => this.onChangePage(e) },
        );

        if (this.props.className) {
            if (!Array.isArray(this.props.className)) {
                this.props.className = [this.props.className];
            }
            this.elem.classList.add(...this.props.className);
        }
    }

    onChangePage(e) {
        e.preventDefault();

        if (e.target.tagName !== 'A') {
            return;
        }

        const page = parseInt(e.target.dataset.page, 10);
        if (Number.isNaN(page)) {
            return;
        }

        if (isFunction(this.props.onChange)) {
            this.props.onChange(page);
        }

        this.setPage(page - 1);
    }

    setPage(page) {
        if (this.state.pageNum === page) {
            return;
        }

        this.state.pageNum = page;
        this.render(this.state);
    }

    getItems(state) {
        const res = [];

        // 1 2 3 4 5
        if (state.pagesCount <= state.breakLimit) {
            for (let i = 0; i < state.pagesCount; i++) {
                res.push({ page: (i + 1), active: (i === state.pageNum) });
            }

            return res;
        }

        if (state.pageNum < state.groupLimit) {
            //  1 2 3 4 5 ... 18
            for (let i = 0; i < state.breakLimit; i++) {
                res.push({ page: (i + 1), active: (i === state.pageNum) });
            }
            res.push({ ellipsis: true });
            res.push({ page: state.pagesCount, active: false });
        } else if (state.pageNum >= state.groupLimit && state.pageNum < state.pagesCount - state.groupLimit) {
            //  1 ... 14 15 16 ... 18
            res.push({ page: 1, active: false });
            res.push({ ellipsis: true });
            for (let i = state.pageNum - (state.groupLimit - 2); i <= state.pageNum + (state.groupLimit - 2); i++) {
                res.push({ page: (i + 1), active: (i === state.pageNum) });
            }
            res.push({ ellipsis: true });
            res.push({ page: state.pagesCount, active: false });
        } else if (state.pageNum >= state.groupLimit && state.pageNum >= state.pagesCount - state.groupLimit) {
            //  1 ... 14 15 16 17 18
            res.push({ page: 1, active: false });
            res.push({ ellipsis: true });
            for (let i = state.pagesCount - state.breakLimit; i < state.pagesCount; i++) {
                res.push({ page: (i + 1), active: (i === state.pageNum) });
            }
        }

        return res;
    }

    renderItem(item) {
        if (item.ellipsis) {
            return ce('span', { className: 'paginator-item', textContent: '...' });
        }

        if (item.active && !this.props.allowActiveLink) {
            return ce('span', {
                className: 'paginator-item paginator-item__active',
                textContent: item.page,
            });
        }

        const res = ce('a', {
            className: 'paginator-item',
            textContent: item.page,
        });
        res.setAttribute('data-page', item.page);

        if (this.props.url) {
            const url = new URL(this.props.url);
            url.searchParams.set(this.props.pageParam, item.page);
            res.href = url;
        }

        if (item.active) {
            res.classList.add('paginator-item__active');
        }

        return res;
    }

    render(state) {
        const items = this.getItems(state);
        const elems = items.map((item) => this.renderItem(item));

        removeChilds(this.elem);
        addChilds(this.elem, elems);
    }
}
