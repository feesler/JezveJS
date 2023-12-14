import {
    query,
    asyncMap,
    evaluate,
    click,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';
import { ControlledInputView } from './ControlledInputView.js';

const controlIds = [
    'formStatus',
    'changeDigitsBtn',
];

export class DecimalInputView extends ControlledInputView {
    inputSelectors = {
        defaultInput: '#decInput',
        digitsLimitInput: '#decInputDigits',
        minMaxDecInput: '#minMaxDecInput',
        integerInput: '#decInputInteger',
        dynamicLimitInput: '#decInputChange',
        positiveInput: '#decInputPositive',
        leadZerosInput: '#decInputZeros',
        createdInput: '#createContainer input',
        testValueInput: '#testValueInput',
    };

    async parseContent() {
        const res = await super.parseContent();

        await asyncMap(controlIds, async (id) => {
            res[id] = { elem: await query(`#${id}`) };
            assert(res[id].elem, `Failed to initialize control '${id}'`);
        });

        [
            res.formStatus.value,
        ] = await evaluate((formStatEl) => ([
            formStatEl.textContent,
        ]), res.formStatus.elem);

        return res;
    }

    buildModel(cont) {
        return {
            ...super.buildModel(cont),
            formStatus: cont.formStatus.value,
        };
    }

    getExpectedState(model = this.model) {
        return {
            ...super.getExpectedState(model),
            changeDigitsBtn: {
                visible: true,
            },
            formStatus: {
                visible: true,
                value: model.formStatus,
            },
        };
    }

    async changeDigitsLimit() {
        await this.performAction(() => click(this.content.changeDigitsBtn.elem));
    }
}
