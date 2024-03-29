import { isFunction } from '@jezvejs/types';
import {
    createSVGElement,
    setEvents,
    createElement,
    getClassName,
} from '@jezvejs/dom';
import { Component } from '../../Component.js';
import './Paginator.scss';

const defaultProps = {
    id: undefined,
    breakLimit: 5,
    groupLimit: 3,
    pageNum: 1,
    pagesCount: 0,
    allowActiveLink: false,
    showSingleItem: false,
    arrows: false,
    pageParam: 'page',
    url: window.location.href,
};

const CONTAINER_CLASS = 'paginator';
const ITEM_CLASS = 'paginator-item';
const ACTIVE_ITEM_CLASS = 'paginator-item__active';
const ARROW_CLASS = 'paginator-arrow';
const ARROW_ICON_CLASS = 'paginator-arrow__icon';
const ARROW_CLASS_PREV = 'paginator-arrow__prev';
const ARROW_CLASS_NEXT = 'paginator-arrow__next';

const ARROW_PATH = 'm2 0.47-0.35-0.35-1.6 1.6 1.6 1.6 0.35-0.35-1.2-1.2z';

export class Paginator extends Component {
    static userProps = {
        elem: ['id'],
    };

    constructor(props = {}) {
        super({
            ...defaultProps,
            ...props,
        });

        const { groupLimit, breakLimit } = this.props;

        this.state = {
            ...this.props,
            breakLimit: Math.max(groupLimit + 1, breakLimit),
        };

        if (this.elem) {
            this.parse();
        } else {
            this.init();
        }

        this.postInit();
    }

    init() {
        this.elem = createElement('div', { className: CONTAINER_CLASS });
    }

    parse() {
        if (!this.elem?.classList?.contains(CONTAINER_CLASS)) {
            throw new Error('Invalid element');
        }

        const items = Array.from(this.elem.querySelectorAll(`.${ITEM_CLASS}`));
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
    }

    postInit() {
        this.setHandlers();
        this.setUserProps();
        this.setClassNames();

        this.render(this.state);
    }

    setHandlers() {
        setEvents(this.elem, { click: (e) => this.onChangePage(e) });
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

    setPage(pageNum) {
        if (
            (this.state.pageNum === pageNum)
            || (pageNum < 1)
            || (pageNum > this.state.pagesCount)
        ) {
            return;
        }

        this.setState({ ...this.state, pageNum });
    }

    setPagesCount(pagesCount) {
        if (this.state.pagesCount === pagesCount) {
            return;
        }

        this.setState({
            ...this.state,
            pagesCount,
            pageNum: (this.state.pageNum > pagesCount) ? 1 : this.state.pageNum,
        });
    }

    setURL(value) {
        const url = value.toString();
        if (this.state.url === url) {
            return;
        }

        this.setState({ ...this.state, url });
    }

    getPageItems(state) {
        const res = [];

        // 1 2 3 4 5
        if (state.pagesCount <= state.breakLimit + 1) {
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

        //  1 ... 13 14 15 ... 18
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
            return createElement('span', { className: ITEM_CLASS, textContent: '...' });
        }

        if (item.active && !this.state.allowActiveLink) {
            return createElement('span', {
                className: getClassName(ITEM_CLASS, ACTIVE_ITEM_CLASS),
                textContent: item.page,
            });
        }

        const res = (item.navigation)
            ? this.renderArrow(item.navigation === 'next')
            : createElement('a', { className: ITEM_CLASS, textContent: item.page });

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

        res.classList.toggle(ACTIVE_ITEM_CLASS, !!item.active);

        return res;
    }

    renderArrow(isNext = false) {
        const arrowIcon = createSVGElement('svg', {
            attrs: { class: ARROW_ICON_CLASS, viewBox: '0 0 2.1 3.4' },
            children: createSVGElement('path', { attrs: { d: ARROW_PATH } }),
        });

        const arrowNavClass = (isNext) ? ARROW_CLASS_NEXT : ARROW_CLASS_PREV;
        return createElement('a', {
            className: getClassName(ITEM_CLASS, ARROW_CLASS, arrowNavClass),
            children: arrowIcon,
        });
    }

    onStateChange(state, prevState) {
        if (
            state.pagesCount === prevState?.pagesCount
            && state.pageNum === prevState?.pageNum
        ) {
            return state;
        }

        const pageNum = (state.pageNum < 1 || state.pageNum > state.pagesCount)
            ? 1
            : state.pageNum;

        return {
            ...state,
            pageNum,
        };
    }

    render(state) {
        const items = this.getItems(state);
        const elems = items.map((item) => this.renderItem(item));

        this.elem.replaceChildren(...elems);
    }
}
