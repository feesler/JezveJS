import { isObject } from '@jezvejs/types';

const mandatoryProps = ['height', 'margin'];

const defaultProps = {
    scaleAroundAxis: true,
    valuesMargin: 0,
    minStep: 0,
    maxStep: 0,
    stacked: false,
    defaultValueRange: 100,
};

/**
 * Chart grid class constructor
 * @param {Object} props
 * @param {Number} props.height - absolute view height in pixels
 * @param {Number} props.margin - top margin in pixels
 * @param {boolean} props.scaleAroundAxis - if set to true y-axis will be always visible
 * @param {Number} props.minStep - minimum grid step in pixels
 * @param {Number} props.maxStep - maximum grid step in pixels
 */
export class ChartGrid {
    constructor(props = {}) {
        mandatoryProps.forEach((propName) => {
            if (!(propName in props)) {
                throw new Error(`Invalid properties: Expected ${propName}`);
            }
        });

        this.props = {
            ...defaultProps,
            ...props,
        };

        this.precision = 0;
        this.valueStep = 1;
        this.valueFirst = 0;
        this.valueLast = 0;
        this.steps = 0;
        this.yFirst = 0;
        this.yLast = 0;
    }

    /** Round value to specified precision */
    roundToPrecision(value, precision) {
        const prec = parseInt(precision, 10);
        return parseFloat(value.toFixed(prec));
    }

    /** Calculate exponent order and precision for specified value */
    getExp(value) {
        let val = Math.abs(value);
        const res = {
            precision: 0,
            exponent: 1,
        };

        if (val > 1) {
            while (val >= 10) {
                val /= 10;
                res.exponent *= 10;
            }
        } else if (val > 0 && val < 1) {
            while (val < 1) {
                val *= 10;
                res.exponent /= 10;
                res.precision += 1;
            }
            res.exponent = this.roundToPrecision(res.exponent, res.precision);
        }

        return res;
    }

    /** Round value to current grid precision and return number */
    toPrec(value) {
        return this.roundToPrecision(value, this.precision);
    }

    /** Round value to current grid precision and return string */
    toPrecString(value) {
        return value.toFixed(this.precision);
    }

    /** Rounds value to nearest less or equal value of current grid order */
    floor(value) {
        const nValue = this.roundToPrecision((value / this.valueStep), 2);
        const res = Math.floor(nValue) * this.valueStep;

        return this.toPrec(res);
    }

    /** Round value to nearest greater or equal value of current grid order */
    ceil(value) {
        const nValue = this.roundToPrecision((value / this.valueStep), 2);
        const res = Math.ceil(nValue) * this.valueStep;

        return this.toPrec(res);
    }

    /** Set raw value range to calculate grid steps */
    setValueRange(min, max) {
        this.minValue = Math.min(min, max);
        this.maxValue = Math.max(min, max);
        this.dValue = Math.abs(max - min);

        const exp = this.getExp(this.dValue);
        this.valueStep = exp.exponent;
        this.precision = exp.precision;
        // Round values to currend grid order
        this.firstStep = this.ceil(this.maxValue);
        this.lastStep = this.floor(this.minValue);
        this.dStep = this.getStepsHeight();
        // Update view range and adjust count of grid steps
        this.setViewRange(this.lastStep, this.firstStep);
        this.adjustSteps();
    }

    /** Set view range */
    setViewRange(min, max) {
        this.viewMin = Math.min(min, max);
        this.viewMax = Math.max(min, max);
        this.viewDelta = Math.abs(max - min);

        this.firstStep = this.getFirst();
        this.lastStep = this.getLast();
        this.dStep = this.getStepsHeight();
        this.steps = this.getSteps();
    }

    /** Increase count of grid steps to be divisible by 4 */
    adjustSteps() {
        while (this.steps < 4) {
            this.splitSteps();
        }

        if (this.steps > 5) {
            const stepsMod = (this.steps % 4);
            if (stepsMod > 0) {
                this.addSteps(4 - stepsMod);
            }
        }
    }

    /** Return value of first grid line */
    getFirst() {
        return this.floor(this.viewMax);
    }

    /** Return value of last grid line */
    getLast() {
        return this.ceil(this.viewMin);
    }

    /** Split each grid step by two */
    splitSteps() {
        this.steps *= 2;
        this.valueStep /= 2;
        if (this.valueStep < 1) {
            this.precision += 1;
        }
    }

    /** Join each two grid step into single one */
    joinSteps() {
        this.steps /= 2;
        this.valueStep *= 2;
    }

    /** Calculate current count of grid line steps */
    getSteps() {
        return Math.abs(Math.round(this.dStep / this.valueStep));
    }

    /** Calculate current height between first and last grid line */
    getStepsHeight() {
        return Math.abs(this.firstStep - this.lastStep);
    }

    /** Returns true in case values are both positive and negative */
    isBoth() {
        return this.minValue < 0 && this.maxValue > 0;
    }

    /** Returns true in case all values is positive */
    isPositive() {
        return this.minValue >= 0 && this.maxValue > 0;
    }

    /** Returns true in case all values is negative */
    isNegative() {
        return this.minValue < 0 && this.maxValue <= 0;
    }

    /** Scale view range of grid by specified count of steps */
    addSteps(steps) {
        if (this.props.scaleAroundAxis && !this.isBoth()) {
            if (this.isPositive()) {
                this.firstStep += steps * this.valueStep;
            } else if (this.isNegative()) {
                this.lastStep -= steps * this.valueStep;
            }
        } else {
            const minDelta = Math.abs(this.minValue - this.lastStep);
            const maxDelta = Math.abs(this.maxValue - this.firstStep);

            if (minDelta > maxDelta) {
                this.lastStep -= Math.floor(steps / 2) * this.valueStep;
                this.firstStep += Math.ceil(steps / 2) * this.valueStep;
            } else {
                this.lastStep -= Math.ceil(steps / 2) * this.valueStep;
                this.firstStep += Math.floor(steps / 2) * this.valueStep;
            }
        }

        this.setViewRange(this.lastStep, this.firstStep);
    }

    /** Scale view range of grid */
    scaleViewRange(value) {
        let scaledMin = this.viewMin;
        let scaledMax = this.viewMax;

        if (this.props.scaleAroundAxis && !this.isBoth()) {
            if (this.isPositive()) {
                scaledMax = this.viewMax * value;
            } else if (this.isNegative()) {
                scaledMin = this.viewMin * value;
            }
        } else {
            const middle = (this.dValue / 2) + this.minValue;
            const distance = (this.viewDelta * value) / 2;
            scaledMin = middle - distance;
            scaledMax = middle + distance;
        }

        this.setViewRange(scaledMin, scaledMax);
    }

    /** Convert relative value to absolute */
    convertRelToAbs(value) {
        return this.props.height * ((value - this.viewMin) / this.viewDelta);
    }

    /** Convert height value from grid to view units */
    getHeight(value) {
        const y0 = this.convertRelToAbs(0);
        const y1 = this.convertRelToAbs(value);
        const height = Math.abs(y0 - y1);
        return this.roundToPrecision(height, 1);
    }

    /** Convert y-axis value from grid to view units */
    getY(value) {
        const yAbs = this.convertRelToAbs(value);
        const y = this.props.height + this.props.margin - yAbs;
        return this.roundToPrecision(y, 1);
    }

    /** Obtain all values from chart data structure */
    getAllValues(values) {
        if (!values.length) {
            return [];
        }

        const [firstItem] = values;
        if (!isObject(firstItem)) {
            return values;
        }

        const dataValues = values.map((item) => item.data);
        if (this.props.stacked) {
            const resIndex = dataValues.reduce((res, item, index) => (
                (dataValues[res].length < item.length) ? index : res
            ), 0);

            const longestData = dataValues[resIndex];
            return longestData.map((_, index) => (
                dataValues.reduce((res, data) => (res + (data[index] ?? 0)), 0)
            ));
        }

        return dataValues.flat();
    }

    /** Calculate grid parameters for specified values */
    calculate(values) {
        const allValues = this.getAllValues(values);
        if (!allValues.length) {
            return;
        }

        const { scaleAroundAxis, defaultValueRange } = this.props;

        let minValue = Math.min(...allValues);
        let maxValue = Math.max(...allValues);
        if (minValue === maxValue) {
            if (scaleAroundAxis) {
                maxValue += defaultValueRange;
            } else {
                minValue -= defaultValueRange / 2;
                maxValue += defaultValueRange / 2;
            }
        }
        if (scaleAroundAxis || allValues.length === 1) {
            minValue = Math.min(minValue, 0);
            maxValue = Math.max(maxValue, 0);
        }

        this.setValueRange(minValue, maxValue);

        // ajdust view scale if needed
        if (this.props.valuesMargin > 0) {
            const scale = (this.dValue / (1 - this.props.valuesMargin)) / this.viewDelta;
            this.scaleViewRange(scale);
        }
        // adjust absolute grid step according to settings
        this.yStep = this.getHeight(this.valueStep);
        if (this.props.maxStep) {
            while (this.yStep > this.props.maxStep) {
                this.splitSteps();
                this.yStep = this.getHeight(this.valueStep);
            }
        }
        if (this.props.minStep) {
            while (this.yStep < this.props.minStep) {
                this.joinSteps();
                this.yStep = this.getHeight(this.valueStep);
            }
        }

        this.valueFirst = this.getFirst();
        this.valueLast = this.getLast();
        this.steps = Math.floor((this.valueFirst - this.viewMin) / this.valueStep);
        this.yFirst = this.getY(this.valueFirst);
        this.yLast = this.getY(this.valueLast);
    }
}
