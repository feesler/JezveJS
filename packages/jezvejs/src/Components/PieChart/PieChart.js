import {
    svg,
    isObject,
    isFunction,
    copyObject,
    setEvents,
    asArray,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import {
    toRadian,
    hexColor,
    svgValue,
    circularArc,
} from './utils.js';
import '../../css/common.scss';
import './style.scss';

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
    onitemclick: null,
    onitemover: null,
    onitemout: null,
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

        this.state = {};
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

        this.elem = svg('svg', {
            class: PIE_CHART_CLASS,
            width: size,
            height: size,
        });

        this.setClassNames();

        this.setData(this.props.data);
    }

    setData(data) {
        if (!Array.isArray(data)) {
            throw new Error('Expected data array');
        }

        if (this.state.data === data) {
            return;
        }

        this.state.data = data.map((item) => {
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

    /** Sector item click event handler */
    onItemClick(e, sector) {
        if (!isFunction(this.props.onitemclick)) {
            return;
        }

        this.props.onitemclick({ sector, event: e });
    }

    /** Sector item mouse over event handler */
    onItemOver(e, sector) {
        if (!isFunction(this.props.onitemover)) {
            return;
        }

        this.props.onitemover({ sector, event: e });
    }

    /** Sector item mouse out from bar event handler */
    onItemOut(e, sector) {
        if (!isFunction(this.props.onitemout)) {
            return;
        }

        this.props.onitemout({ sector, event: e });
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
     * Draw circle sector
     * @param {number} x - x coordinate of center of circle
     * @param {number} y  - y coordinate of center of circle
     * @param {number} r  - radius of circle
     * @param {number} start - start angle of sector in degrees
     * @param {number} arc - angle of sector arc in degrees
     */
    drawSector(x, y, r, ir, start, arc, offset) {
        // center of circle point
        let cx = parseFloat(x);
        let cy = parseFloat(y);
        if (Number.isNaN(cx) || Number.isNaN(cy)) {
            throw new Error(`Invalid coordinates: (${x}; ${y})`);
        }

        const cr = parseFloat(r);
        if (Number.isNaN(cr) || cr === 0.0) {
            throw new Error(`Invalid radius: ${r}`);
        }
        const icr = parseFloat(ir);
        if (Number.isNaN(icr) || icr < 0 || icr > cr) {
            throw new Error(`Invalid radius: ${ir}`);
        }

        const a = toRadian(arc);
        const b = toRadian(start);
        const large = (a < Math.PI) ? 0 : 1;

        if (typeof offset !== 'undefined') {
            const offs = parseFloat(offset);
            if (Number.isNaN(offs)) {
                throw new Error(`Invalid offset: ${offset}`);
            }

            const c = b + (a / 2);
            const offsx = offs * Math.cos(-c);
            const offsy = offs * Math.sin(-c);
            cx += offsx;
            cy += offsy;
        }

        const fcr = svgValue(cr);
        // Outer arc start point
        const sx = cx + cr * Math.cos(a + b);
        const sy = cy - cr * Math.sin(a + b);
        const fsx = svgValue(sx);
        const fsy = svgValue(sy);
        // Outer arc end point
        const ex = cx + cr * Math.cos(b);
        const ey = cy - cr * Math.sin(b);
        // shift from arc start point to arc end point
        const dx = svgValue(ex - sx);
        const dy = svgValue(ey - sy);

        let pathCommand;

        const outerArc = circularArc(fcr, large, 1, dx, dy);
        const outer = `m${fsx} ${fsy} ${outerArc}`;

        // Use inner radius
        if (icr > 0) {
            const ficr = svgValue(icr);
            // Outer arc start point
            const isx = cx + icr * Math.cos(a + b);
            const isy = cy - icr * Math.sin(a + b);
            // Outer arc end point
            const iex = cx + icr * Math.cos(b);
            const iey = cy - icr * Math.sin(b);
            // shift from arc start point to arc end point
            const idx = svgValue(isx - iex);
            const idy = svgValue(isy - iey);

            // shift from outer arc end point to inner arc end point
            const elx = svgValue(iex - ex);
            const ely = svgValue(iey - ey);
            // shift from inner arc start point to outer arc start point
            const slx = svgValue(sx - isx);
            const sly = svgValue(sy - isy);

            const innerArc = circularArc(ficr, large, 0, idx, idy);
            const inner = `l${elx} ${ely} ${innerArc}`;

            pathCommand = `${outer} ${inner} l${slx} ${sly}z`;
        } else {
            // shift from arc end point to center of circle
            const lx = svgValue(cx - ex);
            const ly = svgValue(cy - ey);

            pathCommand = `${outer} l${lx} ${ly}z`;
        }

        return svg('path', { d: pathCommand });
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

        if (typeof data === 'undefined' || data === 0) {
            throw new Error('Invalid data');
        }

        let values = asArray(data);
        const total = this.arraySum(values);
        if (total === 0) {
            throw new Error('Invalid data');
        }

        values = values.map((item) => ({
            ...item,
            arc: 360 * (item.value / total),
        }));
        values.sort((a, b) => (a.value - b.value));

        let start = 0;
        let prevColor;
        const sectorsGroup = svg('g');
        this.sectors = values.map((item, ind) => {
            const sector = copyObject(item);
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
            sector.elem.classList.add(SECTOR_CLASS, `${SECTOR_CATEGORY_CLASS}${ind + 1}`);

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
