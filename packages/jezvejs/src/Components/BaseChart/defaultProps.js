/** Default properties */
export const defaultProps = {
    // Layout
    height: 300,
    columnWidth: 38,
    maxColumnWidth: 38,
    groupsGap: 10,
    marginTop: 10,
    // Grid behavior
    visibilityOffset: 1,
    scaleAroundAxis: true,
    gridValuesMargin: 0.1,
    minGridStep: 30,
    maxGridStep: 60,
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
    renderXAxisLabel: null,
    renderYAxisLabel: null,
    showLegend: false,
    renderLegend: null,
    onlyVisibleCategoriesLegend: false,
    // Popup
    showPopupOnClick: false,
    pinPopupOnClick: false,
    showPopupOnHover: false,
    animatePopup: false,
    renderPopup: null,
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
};
