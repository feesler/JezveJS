import { createSVGElement, setAttributes } from '@jezvejs/dom';
import { formatCoord, BaseChartActiveGroup } from 'jezvejs/BaseChart';

import './CustomActiveGroup.scss';
import { minmax } from 'jezvejs';

/* CSS classes */
const LINE_CLASS = 'chart__active-group-line';

/**
 * Chart active group component
 */
export class CustomActiveGroup extends BaseChartActiveGroup {
    init() {
        super.init();

        this.line = createSVGElement('path', {
            attrs: { class: LINE_CLASS },
        });
        this.elem.append(this.line);
    }

    getColumnHeight(state) {
        const { dataSets } = state;
        if (dataSets.length === 0) {
            return 0;
        }

        const { groupIndex } = state.activeGroup;
        let value = 0;
        dataSets.forEach((dataSet) => {
            const itemValue = dataSet.data[groupIndex] ?? 0;
            value += itemValue;
        });

        const { grid } = state;
        const valueOffset = 0;
        const y0 = grid.getY(valueOffset);
        const y1 = grid.getY(value + valueOffset);
        const height = grid.roundToPrecision(Math.abs(y0 - y1), 1);

        return height;
    }

    render(state, prevState = {}) {
        super.render(state, prevState);

        if (!state.activeGroup) {
            return;
        }

        const columnHeight = this.getColumnHeight(state);
        const groupWidth = this.getGroupOuterWidth(state);
        const { groupIndex } = state.activeGroup;

        const padding = 5;
        const rX = formatCoord((groupIndex + 0.5) * groupWidth);
        const y0 = padding;
        const y1 = formatCoord(
            minmax(
                padding,
                state.height - padding,
                state.height - columnHeight - padding,
            ),
        );

        setAttributes(this.line, {
            d: `M${rX},${y0}L${rX},${y1}`,
        });
    }
}
