import { createElement } from '@jezvejs/dom';

export const chartContainer = (id, chart) => createElement('div', {
    props: { id, className: 'std_chart_wrap' },
    children: chart?.elem,
});

export const formatDecimalValue = (val) => val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');

export const formatAsUSD = (value) => `$ ${formatDecimalValue(value)}`;
