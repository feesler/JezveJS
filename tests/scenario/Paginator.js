import {
    baseUrl,
    goTo,
    setBlock,
} from 'jezve-test';
import * as PaginatorTests from '../run/Paginator.js';

export const paginatorTests = async () => {
    const pageUrl = `${baseUrl()}demo/paginator.html`;
    await goTo(pageUrl);

    setBlock('Paginator component', 1);
    await PaginatorTests.goToNextPage('styledPaginator');
    await PaginatorTests.goToPrevPage('styledPaginator');
    await PaginatorTests.goToLastPage('styledPaginator');
    await PaginatorTests.goToFirstPage('styledPaginator');

    await PaginatorTests.goToNextPage('handlerPaginator');
    await PaginatorTests.goToLastPage('handlerPaginator');
};
