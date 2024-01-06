import { BaseChartActiveGroup } from './components/ActiveGroup/BaseChartActiveGroup.js';
import { BaseChartGrid } from './components/Grid/BaseChartGrid.js';
import { BaseChartLegend } from './components/Legend/BaseChartLegend.js';
import { BaseChartPopup } from './components/Popup/BaseChartPopup.js';
import { BaseChartXAxisLabels } from './components/xAxisLabels/BaseChartXAxisLabels.js';
import { BaseChartYAxisLabels } from './components/yAxisLabels/BaseChartYAxisLabels.js';

/** Default properties */
export const defaultProps = {
    // Layout
    height: 300,
    columnWidth: 38,
    maxColumnWidth: 38,
    groupsGap: 10,
    marginTop: 10,
    alignColumns: 'left', // available values: 'left', 'right' and 'center'
    // Grid behavior
    visibilityOffset: 1,
    scaleAroundAxis: true,
    gridValuesMargin: 0.1,
    minGridStep: 30,
    maxGridStep: 60,
    xAxisGrid: false,
    // Render properties
    fitToWidth: false,
    allowLastXAxisLabelOverflow: true,
    scrollToEnd: false,
    autoScale: false,
    animate: false,
    animationEndTimeout: 500,
    autoScaleTimeout: 200,
    resizeTimeout: 200,
    activateOnClick: false,
    activateOnHover: false,
    xAxis: 'bottom', // available values: 'bottom', 'top' and 'none'
    yAxis: 'right', // available values: 'right', 'left' and 'none'
    yAxisLabelsAlign: 'left', // available values: 'left', 'right' and 'center'
    renderXAxisLabel: null,
    renderYAxisLabel: null,
    showLegend: false,
    renderLegend: null,
    onlyVisibleCategoriesLegend: false,
    // Active group
    showActiveGroup: false,
    // Popup
    showPopupOnClick: false,
    pinPopupOnClick: false,
    showPopupOnHover: false,
    animatePopup: false,
    renderPopup: null,
    popupPosition: 'right',
    // Callbacks
    onScroll: null,
    onResize: null,
    onItemClick: null,
    onItemOver: null,
    onItemOut: null,
    // Data
    data: {
        values: [],
        series: [],
        stacked: false,
    },
    components: {
        Grid: BaseChartGrid,
        XAxisLabels: BaseChartXAxisLabels,
        YAxisLabels: BaseChartYAxisLabels,
        Legend: BaseChartLegend,
        ChartPopup: BaseChartPopup,
        ActiveGroup: BaseChartActiveGroup,
    },
};
