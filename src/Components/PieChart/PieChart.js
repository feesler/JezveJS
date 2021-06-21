import {
    svg,
    isObject,
    isFunction,
    copyObject,
    removeChilds,
} from '../../js/common.js';
import { Component } from '../../js/Component.js';
import './piechart.css';

/* eslint-disable no-bitwise */

/**
 * Pie chart component class
 * @param {Object} props
 * @param {string|Element} props.elem - base element for component
 */
export class PieChart extends Component {
    constructor(props) {
        super(props);

        if (!Array.isArray(this.props.data)) {
            throw new Error('Expected data array');
        }
        this.data = this.props.data.map((item) => {
            let value;
            const res = {};

            if (isObject(item)) {
                if (!('value' in item)) {
                    throw new Error('Value property expected');
                }

                value = item.value;
                res.title = item.title.toString();
                if (item.offset) {
                    res.offset = parseFloat(item.offset);
                }
            } else {
                value = item;
            }

            res.value = parseFloat(value);
            if (Number.isNaN(res.value)) {
                throw new Error(`Invalid data value: ${value}`);
            }

            return res;
        });

        if (!('radius' in this.props)) {
            throw new Error('Radius not specified');
        }
        this.radius = parseFloat(this.props.radius);
        if (Number.isNaN(this.radius) || this.radius === 0) {
            throw new Error(`Invalid radius specified: ${this.props.radius}`);
        }

        this.offset = 0;
        if ('offset' in this.props) {
            this.offset = parseFloat(this.props.offset);
            if (Number.isNaN(this.offset)) {
                throw new Error(`Invalid offset specified: ${this.props.offset}`);
            }
        }

        if ('colors' in this.props) {
            this.colors = this.props.colors;
        } else {
            this.colors = [];
        }

        this.extraClass = this.props.extraClass;

        this.itemClickHandler = isFunction(this.props.onitemclick) ? this.props.onitemclick : null;
        this.itemOverHandler = isFunction(this.props.onitemover) ? this.props.onitemover : null;
        this.itemOutHandler = isFunction(this.props.onitemout) ? this.props.onitemout : null;

        this.sectors = [];
        this.render();
    }

    /** Calculate sum of array values */
    arraySum(data) {
        if (!Array.isArray(data)) {
            throw new Error('Invalid data: array is expected');
        }

        return data.reduce((res, item) => (res + item.value), 0);
    }

    /** Convert degrees to radians */
    toRadian(val) {
        const fval = parseFloat(val);
        if (Number.isNaN(fval)) {
            throw new Error('Invalid value');
        }

        return (fval % 360) * (Math.PI / 180);
    }

    /** Format value as hexadecimal */
    toHex(val) {
        const v = parseInt(val, 10);
        if (Number.isNaN(v)) {
            throw new Error('Invalid data');
        }

        return ((v < 0x10) ? '0' : '') + v.toString(16);
    }

    /** Format color as hexadecimal */
    hexColor(val) {
        const r = (val & 0xFF0000) >> 16;
        const g = (val & 0x00FF00) >> 8;
        const b = (val & 0x0000FF);

        return `#${this.toHex(r)}${this.toHex(g)}${this.toHex(b)}`;
    }

    /** Format color as hexadecimal */
    getNextColor(val) {
        if (!val) {
            return this.colors[0];
        }

        const ind = this.colors.indexOf(val);
        if (ind === -1 || ind === this.colors.length - 1) {
            return this.colors[0];
        }

        return this.colors[ind + 1];
    }

    /**
     * Draw circle sector
     * @param {number} x - x coordinate of center of circle
     * @param {number} y  - y coordinate of center of circle
     * @param {number} r  - radius of circle
     * @param {number} start - start angle of sector in degrees
     * @param {number} arc - angle of sector arc in degrees
     */
    drawSector(x, y, r, start, arc, offset) {
        const prec = 5;
        const rotate = 0;
        const clockwise = 1;

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

        const a = this.toRadian(arc);
        const b = this.toRadian(start);
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

        // arc start point
        const sx = cx + cr * Math.cos(a + b);
        const sy = cy - cr * Math.sin(a + b);
        // arc end point
        const ex = cx + cr * Math.cos(b);
        const ey = cy - cr * Math.sin(b);

        // shift from arc start point to acr end point
        const dx = ex - sx;
        const dy = ey - sy;

        // shift from arc end point to center of circle
        const lx = cx - ex;
        const ly = cy - ey;

        const pathCommand = `m${sx.toFixed(prec)} ${sy.toFixed(prec)} a${cr.toFixed(prec)}
        ${cr.toFixed(prec)} ${rotate} ${large} ${clockwise} ${dx.toFixed(prec)}
        ${dy.toFixed(prec)} l${lx.toFixed(prec)} ${ly.toFixed(prec)}z`;

        return svg('path', { d: pathCommand });
    }

    /** Draw pie chart */
    drawPie(width, height, radius, data) {
        const r = parseFloat(radius);
        if (Number.isNaN(r) || r === 0.0) {
            throw new Error('Invalid radius');
        }

        if (typeof data === 'undefined' || data === 0) {
            throw new Error('Invalid data');
        }

        let values = Array.isArray(data) ? data : [data];
        const total = this.arraySum(values);
        if (total === 0) {
            throw new Error('Invalid data');
        }

        values = values.map((item) => {
            const sector = item;
            sector.arc = 360 * (sector.value / total);
            return sector;
        });
        values.sort((a, b) => (a.value - b.value));

        let start = 0;
        let prevColor;
        this.sectors = values.map((item, ind) => {
            const sector = copyObject(item);
            sector.start = start;
            sector.elem = this.drawSector(
                width / 2,
                height / 2,
                r,
                sector.start,
                sector.arc,
                sector.offset,
            );
            sector.elem.classList.add('pie__sector', `pie__sector-${ind + 1}`);

            if (this.colors.length > 0) {
                sector.color = this.getNextColor(prevColor);
                prevColor = sector.color;
                sector.elem.setAttribute('fill', this.hexColor(sector.color));
            }

            function clickHandler(e) {
                this.onItemClick.call(this, e, sector);
            }

            function mouseOverHandler(e) {
                this.onItemOver.call(this, e, sector);
            }

            function mouseOutHandler(e) {
                this.onItemOut.call(this, e, sector);
            }

            sector.elem.addEventListener('mouseover', mouseOverHandler.bind(this));
            sector.elem.addEventListener('mouseout', mouseOutHandler.bind(this));
            sector.elem.addEventListener('click', clickHandler.bind(this));

            start += sector.arc;

            return sector;
        }, this);

        const res = svg('svg', {
            class: 'pie-chart',
            width,
            height,
        });
        this.sectors.forEach((sector) => {
            res.appendChild(sector.elem);
        });

        if (this.extraClass) {
            res.classList.add(this.extraClass);
        }

        return res;
    }

    /** Draw currenct state of pie chart */
    render() {
        this.container = this.drawPie(
            (this.radius + this.offset) * 2,
            (this.radius + this.offset) * 2,
            this.radius,
            this.data,
        );

        removeChilds(this.elem);
        this.elem.appendChild(this.container);
    }

    /** Sector item click event handler */
    onItemClick(e, sector) {
        if (!isFunction(this.itemClickHandler)) {
            return;
        }

        this.itemClickHandler.call(this, e, sector);
    }

    /** Sector item mouse over event handler */
    onItemOver(e, sector) {
        if (!isFunction(this.itemOverHandler)) {
            return;
        }

        this.itemOverHandler.call(this, e, sector);
    }

    /** Sector item mouse out from bar event handler */
    onItemOut(e, sector) {
        if (!isFunction(this.itemOutHandler)) {
            return;
        }

        this.itemOutHandler.call(this, e, sector);
    }

    /** Static alias for PieChart constructor */
    static create(props) {
        try {
            return new PieChart(props);
        } catch (e) {
            console.error(e);
            return null;
        }
    }
}
