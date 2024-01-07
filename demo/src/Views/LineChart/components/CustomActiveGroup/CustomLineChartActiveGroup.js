import { createSVGElement, setAttributes } from '@jezvejs/dom';
import { minmax } from 'jezvejs';
import { formatCoord, BaseChartActiveGroup } from 'jezvejs/BaseChart';

import './CustomLineChartActiveGroup.scss';

/* CSS classes */
const LINE_CLASS = 'chart__active-group-line';

/**
 * Chart active group component
 */
export class CustomLineChartActiveGroup extends BaseChartActiveGroup {
    init() {
        super.init();

        this.lineBefore = createSVGElement('path', {
            attrs: { class: LINE_CLASS },
        });
        this.lineAfter = createSVGElement('path', {
            attrs: { class: LINE_CLASS },
        });
        this.elem.append(this.lineBefore, this.lineAfter);
    }

    getItemPosition(state) {
        const { dataSets } = state;
        if (dataSets.length === 0) {
            return 0;
        }

        const { groupIndex } = state.activeTarget;
        let value = 0;
        dataSets.forEach((dataSet) => {
            const itemValue = dataSet.data[groupIndex] ?? 0;
            value += itemValue;
        });

        const { grid } = state;
        const y = grid.getY(value);
        return grid.roundToPrecision(y, 1);
    }

    render(state, prevState = {}) {
        super.render(state, prevState);

        if (!state.activeTarget) {
            return;
        }

        const itemPos = this.getItemPosition(state);
        const groupWidth = this.getGroupOuterWidth(state);
        const { groupIndex } = state.activeTarget;

        const padding = 10;
        const rX = formatCoord((groupIndex + 0.5) * groupWidth);
        const y0Before = padding;
        const y1Before = formatCoord(
            minmax(
                padding,
                state.height - padding * 2,
                itemPos - padding,
            ),
        );

        setAttributes(this.lineBefore, {
            d: `M${rX},${y0Before}L${rX},${y1Before}`,
        });

        const y0After = formatCoord(
            minmax(
                padding * 2,
                state.height - padding,
                itemPos + padding,
            ),
        );
        const y1After = formatCoord(state.height - padding);

        setAttributes(this.lineAfter, {
            d: `M${rX},${y0After}L${rX},${y1After}`,
        });
    }
}
