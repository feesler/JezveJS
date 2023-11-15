import { isFunction, isObject, asArray } from '@jezvejs/types';
import {
    createSVGElement,
    setEvents,
} from '@jezvejs/dom';
import { Component } from '../../Component.js';
import {
    hexColor,
    svgValue,
    circularArc,
} from './utils.js';
import '../../common.scss';
import './PieChart.scss';

/** CSS classes */
const PIE_CHART_CLASS = 'pie-chart';
const SECTOR_CLASS = 'pie__sector';
const SECTOR_CATEGORY_CLASS = 'pie__sector-';

/** Default properties */
const defaultProps = {
    radius: 150,
    innerRadius: 0,
    offset: 0,
    data: null,
    colors: [],
    className: null,
    onItemClick: null,
    onItemOver: null,
    onItemOut: null,
};

/**
 * Pie chart component
 */
export class PieChart extends Component {
    constructor(props) {
        super(props);

        this.props = {
            ...defaultProps,
            ...this.props,
        };

        this.state = {
            blockTouch: false,
        };
        this.sectors = [];
        this.sectorsGroup = null;

        const radius = parseFloat(this.props.radius);
        if (Number.isNaN(radius) || radius === 0) {
            throw new Error(`Invalid radius specified: ${this.props.radius}`);
        }
        this.props.radius = radius;

        const innerRadius = parseFloat(this.props.innerRadius);
        if (Number.isNaN(innerRadius) || innerRadius < 0 || innerRadius >= radius) {
            throw new Error(`Invalid innerRadius specified: ${this.props.innerRadius}`);
        }
        this.props.innerRadius = innerRadius;

        const offset = parseFloat(this.props.offset);
        if (Number.isNaN(offset)) {
            throw new Error(`Invalid offset specified: ${this.props.offset}`);
        }
        this.props.offset = offset;

        this.init();
    }

    init() {
        const { radius, offset } = this.props;
        const size = (radius + offset) * 2;

        this.elem = createSVGElement('svg', {
            attrs: {
                class: PIE_CHART_CLASS,
                viewBox: `0 0 ${size} ${size}`,
            },
        });
        setEvents(this.elem, { touchstart: (e) => this.onTouchStart(e) });

        this.setClassNames();

        this.setData(this.props.data);
    }

    setData(data) {
        if (this.state.data === data) {
            return;
        }

        const items = asArray(data);
        this.state.data = items.map((item) => {
            const res = isObject(item) ? { ...item } : { value: item };

            if (!('value' in res)) {
                throw new Error('Value property expected');
            }
            const value = parseFloat(res.value);
            if (Number.isNaN(value)) {
                throw new Error(`Invalid data value: ${res.value}`);
            }
            res.value = value;

            if ('offset' in res) {
                const offset = parseFloat(res.offset);
                if (Number.isNaN(offset)) {
                    throw new Error(`Invalid offset value: ${res.offset}`);
                }
                res.offset = offset;
            }

            return res;
        });

        this.render(this.state);
    }

    /** Chart content 'touchstart' event handler */
    onTouchStart(e) {
        if (e.touches) {
            this.state.blockTouch = true;
        }
    }

    /** Sector item 'click' event handler */
    onItemClick(e, sector) {
        if (!isFunction(this.props.onItemClick)) {
            return;
        }

        this.props.onItemClick({ sector, event: e });
    }

    /** Sector item 'mouseover' event handler */
    onItemOver(e, sector) {
        if (
            this.state.blockTouch
            || !isFunction(this.props.onItemOver)
        ) {
            return;
        }

        this.props.onItemOver({ sector, event: e });
    }

    /** Sector item 'mouseout' from bar event handler */
    onItemOut(e, sector) {
        if (
            this.state.blockTouch
            || !isFunction(this.props.onItemOut)
        ) {
            return;
        }

        this.props.onItemOut({ sector, event: e });
    }

    /** Calculate sum of array values */
    arraySum(data) {
        if (!Array.isArray(data)) {
            throw new Error('Invalid data: array is expected');
        }

        return data.reduce((res, item) => (res + item.value), 0);
    }

    /** Format color as hexadecimal */
    getNextColor(val) {
        const { colors } = this.props;

        if (!val) {
            return colors[0];
        }

        const ind = colors.indexOf(val);
        if (ind === -1 || ind === colors.length - 1) {
            return colors[0];
        }

        return colors[ind + 1];
    }

    /**
     * Draw full circle sector
     * @param {number} x - x coordinate of center of circle
     * @param {number} y - y coordinate of center of circle
     * @param {number} r - radius of circle
     * @param {number} ir - inner radius of circle
     * @param {number} offset - offset from center of circles
     */
    drawFullSector(x, y, r, ir, offset = 0) {
        const offs = parseFloat(offset);
        if (Number.isNaN(offs)) {
            throw new Error(`Invalid offset: ${offset}`);
        }

        const outer1 = circularArc(x, y, r + offs, 0, 180, 0, true);
        const outer2 = circularArc(x, y, r + offs, 180, 180, 0, true);
        const outerSX = svgValue(outer1.startX);
        const outerSY = svgValue(outer1.startY);
        const outer = `m${outerSX} ${outerSY} ${outer1.command} ${outer2.command}z`;

        if (ir === 0) {
            return createSVGElement('path', { attrs: { d: outer } });
        }

        const inner1 = circularArc(x, y, ir + offs, 0, 180, 0, false);
        const inner2 = circularArc(x, y, ir + offs, 180, 180, 0, false);
        const dX = svgValue(outer1.endX - inner1.startX);
        const dY = svgValue(outer1.endY - inner1.startY);
        const inner = `m${dX} ${dY} ${inner1.command} ${inner2.command}z`;

        return createSVGElement('path', { attrs: { d: `${outer} ${inner}` } });
    }

    /**
     * Draw circle sector
     * @param {number} x - x coordinate of center of circle
     * @param {number} y - y coordinate of center of circle
     * @param {number} r - radius of circle
     * @param {number} ir - inner radius of circle
     * @param {number} start - start angle of sector in degrees
     * @param {number} arc - angle of sector arc in degrees
     * @param {number} offset - offset from center of circles
     */
    drawSector(x, y, r, ir, start, arc, offset) {
        const cx = parseFloat(x);
        const cy = parseFloat(y);
        if (Number.isNaN(cx) || Number.isNaN(cy)) {
            throw new Error(`Invalid coordinates: (${x}; ${y})`);
        }

        const radius = parseFloat(r);
        if (Number.isNaN(radius) || radius === 0.0) {
            throw new Error(`Invalid radius: ${r}`);
        }

        const innerRadius = parseFloat(ir);
        if (Number.isNaN(innerRadius) || innerRadius < 0 || innerRadius > radius) {
            throw new Error(`Invalid inner radius: ${ir}`);
        }

        if (arc === 360) {
            return this.drawFullSector(x, y, r, ir, offset);
        }

        // Outer arc
        const outerArc = circularArc(x, y, r, start, arc, offset, true);
        const fsx = svgValue(outerArc.startX);
        const fsy = svgValue(outerArc.startY);
        const outer = `m${fsx} ${fsy} ${outerArc.command}`;

        if (innerRadius === 0) {
            // shift from arc end point to center of circle
            const lx = svgValue(outerArc.centerX - outerArc.endX);
            const ly = svgValue(outerArc.centerY - outerArc.endY);

            return createSVGElement('path', { attrs: { d: `${outer} l${lx} ${ly}z` } });
        }

        // Use inner radius
        const innerArc = circularArc(x, y, ir, start, arc, offset, false);
        // shift from outer arc end point to inner arc end point
        const elx = svgValue(innerArc.endX - outerArc.endX);
        const ely = svgValue(innerArc.endY - outerArc.endY);
        // shift from inner arc start point to outer arc start point
        const slx = svgValue(outerArc.startX - innerArc.startX);
        const sly = svgValue(outerArc.startY - innerArc.startY);

        const inner = `l${elx} ${ely} ${innerArc.command}`;

        return createSVGElement('path', { attrs: { d: `${outer} ${inner} l${slx} ${sly}z` } });
    }

    /** Draw pie chart */
    drawPie(width, height, radius, innerRadius, data) {
        const r = parseFloat(radius);
        if (Number.isNaN(r) || r === 0.0) {
            throw new Error('Invalid radius');
        }
        const ir = parseFloat(innerRadius);
        if (Number.isNaN(ir) || ir < 0 || ir > r) {
            throw new Error('Invalid radius');
        }

        let values = asArray(data);
        const total = this.arraySum(values);
        if (total === 0) {
            this.sectorsGroup?.remove();
            this.sectorsGroup = null;
            return;
        }

        values = values
            .filter((item) => item.value > 0)
            .map((item) => ({
                ...item,
                arc: 360 * (item.value / total),
            }));
        values.sort((a, b) => (a.value - b.value));

        let start = 0;
        let prevColor;
        const sectorsGroup = createSVGElement('g');
        this.sectors = values.map((item, ind) => {
            const sector = structuredClone(item);
            sector.start = start;
            sector.elem = this.drawSector(
                width / 2,
                height / 2,
                r,
                ir,
                sector.start,
                sector.arc,
                sector.offset,
            );
            const category = item.category ?? (ind + 1);
            sector.elem.classList.add(SECTOR_CLASS, `${SECTOR_CATEGORY_CLASS}${category}`);

            if (this.props.colors.length > 0) {
                sector.color = this.getNextColor(prevColor);
                prevColor = sector.color;
                sector.elem.setAttribute('fill', hexColor(sector.color));
            }

            setEvents(sector.elem, {
                click: (e) => this.onItemClick(e, sector),
                mouseover: (e) => this.onItemOver(e, sector),
                mouseout: (e) => this.onItemOut(e, sector),
            });

            start += sector.arc;

            sectorsGroup.append(sector.elem);

            return sector;
        });

        this.sectorsGroup?.remove();
        this.elem.append(sectorsGroup);
        this.sectorsGroup = sectorsGroup;
    }

    /** Renders currenct state of pie chart */
    render(state) {
        const { radius, innerRadius, offset } = this.props;
        const { data } = state;

        this.drawPie(
            (radius + offset) * 2,
            (radius + offset) * 2,
            radius,
            innerRadius,
            data,
        );
    }
}
