import { addChilds, ce, removeChilds } from '../../js/common.js';
import { Component } from '../../js/Component.js';
import './paginator.css';

const defaultProps = {
    breakLimit: 5,
    groupLimit: 3,
    pageNum: 0,
    pagesCount: 0,
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
    }

    onChangePage(e) {
        e.preventDefault();

        if (e.target.tagName === 'A') {
            const page = parseInt(e.target.textContent, 10);
            if (!Number.isNaN(page)) {
                this.setPage(page - 1);
            }
        }
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
                res.push({ title: (i + 1), active: (i === state.pageNum) });
            }

            return res;
        }

        if (state.pageNum < state.groupLimit) {
            //  1 2 3 4 5 ... 18
            for (let i = 0; i < state.breakLimit; i++) {
                res.push({ title: (i + 1), active: (i === state.pageNum) });
            }
            res.push({ title: '...' });
            res.push({ title: state.pagesCount, active: false });
        } else if (state.pageNum >= state.groupLimit && state.pageNum < state.pagesCount - state.groupLimit) {
            //  1 ... 14 15 16 ... 18
            res.push({ title: 1, active: false });
            res.push({ title: '...' });
            for (let i = state.pageNum - (state.groupLimit - 2); i <= state.pageNum + (state.groupLimit - 2); i++) {
                res.push({ title: (i + 1), active: (i === state.pageNum) });
            }
            res.push({ title: '...' });
            res.push({ title: state.pagesCount, active: false });
        } else if (state.pageNum >= state.groupLimit && state.pageNum >= state.pagesCount - state.groupLimit) {
            //  1 ... 14 15 16 17 18
            res.push({ title: 1, active: false });
            res.push({ title: '...' });
            for (let i = state.pagesCount - state.breakLimit; i < state.pagesCount; i++) {
                res.push({ title: (i + 1), active: (i === state.pageNum) });
            }
        }

        return res;
    }

    render(state) {
        const items = this.getItems(state);
        const elems = items.map((item) => (
            ('active' in item)
                ? ce('span', {}, (
                    (item.active)
                        ? ce('b', { textContent: item.title })
                        : ce('a', { textContent: item.title, href: '#' })
                ))
                : ce('span', { textContent: item.title })
        ));

        removeChilds(this.elem);
        addChilds(this.elem, elems);
    }
}
