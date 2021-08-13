import {
    addChilds,
    ce,
    svg,
    isFunction,
    removeChilds,
    setEvents,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import './paginator.css';

const defaultProps = {
    breakLimit: 5,
    groupLimit: 3,
    pageNum: 1,
    pagesCount: 0,
    allowActiveLink: false,
    showSingleItem: false,
    arrows: false,
    pageParam: 'page',
    url: window.location,
};

const CONTAINER_CLASS = 'paginator';
const ITEM_CLASS = 'paginator-item';
const ACTIVE_ITEM_CLASS = 'paginator-item__active';
const ARROW_CLASS = 'paginator-arrow';
const ARROW_CLASS_PREV = 'paginator-arrow__prev';
const ARROW_CLASS_NEXT = 'paginator-arrow__next';

export class Paginator extends Component {
    static create(props = {}) {
        const instance = new Paginator(props);
        instance.init();
        return instance;
    }

    static fromElement(elem, props = {}) {
        const instance = new Paginator(props);
        instance.parse(elem);
        return instance;
    }

    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.state = {
            ...this.props,
        };
    }

    init() {
        this.elem = ce('div', { className: CONTAINER_CLASS });
        this.setHandlers();
        this.setClassNames();

        this.render(this.state);
    }

    parse(elem) {
        if (!elem || !elem.classList || !elem.classList.contains(CONTAINER_CLASS)) {
            throw new Error('Invalid element');
        }

        this.elem = elem;
        this.setHandlers();
        this.setClassNames();

        const items = Array.from(elem.querySelectorAll(`.${ITEM_CLASS}`));
        items.forEach((item) => {
            if (item.classList.contains(ARROW_CLASS)) {
                this.state.arrows = true;
                return;
            }

            if (!item.dataset.page) {
                return;
            }
            const page = parseInt(item.dataset.page, 10);
            if (Number.isNaN(page)) {
                return;
            }

            if (item.classList.contains(ACTIVE_ITEM_CLASS)) {
                this.state.pageNum = page;
            }
            this.state.pagesCount = page;
        });

        this.render(this.state);
    }

    setHandlers() {
        setEvents(this.elem, { click: (e) => this.onChangePage(e) });
    }

    setClassNames() {
        if (!this.props.className) {
            return;
        }

        if (!Array.isArray(this.props.className)) {
            this.props.className = [this.props.className];
        }
        this.elem.classList.add(...this.props.className);
    }

    onChangePage(e) {
        if (!isFunction(this.props.onChange)) {
            return;
        }

        e.preventDefault();

        const itemTarget = e.target.closest(`.${ITEM_CLASS}`);
        if (!itemTarget || !itemTarget.dataset.page) {
            return;
        }

        const page = parseInt(itemTarget.dataset.page, 10);
        if (Number.isNaN(page)) {
            return;
        }

        this.props.onChange(page);

        this.setPage(page);
    }

    setPage(page) {
        if (this.state.pageNum === page) {
            return;
        }

        this.state.pageNum = page;
        this.render(this.state);
    }

    setPagesCount(pagesCount) {
        if (this.state.pagesCount === pagesCount) {
            return;
        }

        this.state.pagesCount = pagesCount;
        if (this.state.pageNum > pagesCount) {
            this.state.pageNum = 1;
        }
        this.render(this.state);
    }

    setURL(url) {
        this.state.url = url.toString();
        this.render(this.state);
    }

    getPageItems(state) {
        const res = [];

        // 1 2 3 4 5
        if (state.pagesCount <= state.breakLimit) {
            for (let i = 1; i <= state.pagesCount; i += 1) {
                res.push({ page: i, active: (i === state.pageNum) });
            }

            return res;
        }

        //  1 2 3 4 5 ... 18
        if (state.pageNum < state.breakLimit) {
            for (let i = 1; i <= state.breakLimit; i += 1) {
                res.push({ page: i, active: (i === state.pageNum) });
            }
            res.push({ ellipsis: true });
            res.push({ page: state.pagesCount, active: false });

            return res;
        }

        //  1 ... 14 15 16 ... 18
        if (state.pageNum <= state.pagesCount - state.breakLimit + 1) {
            res.push({ page: 1, active: false });
            res.push({ ellipsis: true });
            for (
                let i = state.pageNum - (state.groupLimit - 2);
                i <= state.pageNum + (state.groupLimit - 2);
                i += 1
            ) {
                res.push({ page: i, active: (i === state.pageNum) });
            }
            res.push({ ellipsis: true });
            res.push({ page: state.pagesCount, active: false });

            return res;
        }

        //  1 ... 14 15 16 17 18
        res.push({ page: 1, active: false });
        res.push({ ellipsis: true });
        for (let i = state.pagesCount - state.breakLimit + 1; i <= state.pagesCount; i += 1) {
            res.push({ page: i, active: (i === state.pageNum) });
        }

        return res;
    }

    getItems(state) {
        const res = [];

        if (!state.showSingleItem && state.pagesCount < 2) {
            return res;
        }

        // Previous page arrow
        if (state.arrows) {
            const navItem = { navigation: 'prev' };
            if (state.pageNum > 1) {
                navItem.page = state.pageNum - 1;
            }
            res.push(navItem);
        }

        const pageItems = this.getPageItems(state);
        res.push(...pageItems);

        // Next page arrow
        if (state.arrows) {
            const navItem = { navigation: 'next' };
            if (state.pageNum < state.pagesCount) {
                navItem.page = state.pageNum + 1;
            }
            res.push(navItem);
        }

        return res;
    }

    renderItem(item) {
        if (item.ellipsis) {
            return ce('span', { className: ITEM_CLASS, textContent: '...' });
        }

        if (item.active && !this.state.allowActiveLink) {
            return ce('span', {
                className: `${ITEM_CLASS} ${ACTIVE_ITEM_CLASS}`,
                textContent: item.page,
            });
        }

        let res;
        if (item.navigation) {
            res = (item.navigation === 'prev')
                ? this.renderPrevArrow()
                : this.renderNextArrow();
        } else {
            res = ce('a', {
                className: ITEM_CLASS,
                textContent: item.page,
            });
        }

        if (item.page) {
            res.setAttribute('data-page', item.page);
        } else {
            res.setAttribute('disabled', true);
        }

        if (this.state.url) {
            const url = new URL(this.state.url);
            url.searchParams.set(this.state.pageParam, item.page);
            res.href = url;
        }

        if (item.active) {
            res.classList.add(ACTIVE_ITEM_CLASS);
        }

        return res;
    }

    renderPrevArrow() {
        return ce(
            'a',
            { className: `${ITEM_CLASS} ${ARROW_CLASS} ${ARROW_CLASS_PREV}` },
            svg('svg', { viewBox: '0 0 6 13' }, svg('path', { d: 'm6 1-6 5.5 6 5.5z' })),
        );
    }

    renderNextArrow() {
        return ce(
            'a',
            { className: `${ITEM_CLASS} ${ARROW_CLASS} ${ARROW_CLASS_NEXT}` },
            svg('svg', { viewBox: '0 0 6 13' }, svg('path', { d: 'm0 1 6 5.5-6 5.5z' })),
        );
    }

    render(state) {
        const items = this.getItems(state);
        const elems = items.map((item) => this.renderItem(item));

        removeChilds(this.elem);
        addChilds(this.elem, elems);
    }
}
