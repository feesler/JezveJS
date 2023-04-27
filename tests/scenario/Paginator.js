import {
    baseUrl,
    goTo,
    setBlock,
} from 'jezve-test';
import * as Actions from '../actions/Paginator.js';

export const paginatorTests = async () => {
    const pageUrl = `${baseUrl()}demo/paginator.html`;
    await goTo(pageUrl);

    setBlock('Paginator component', 1);
    await Actions.goToNextPage('styledPaginator');
    await Actions.goToPrevPage('styledPaginator');
    await Actions.goToLastPage('styledPaginator');
    await Actions.goToFirstPage('styledPaginator');

    await Actions.goToNextPage('callbacksPaginator');
    await Actions.goToLastPage('callbacksPaginator');
};
