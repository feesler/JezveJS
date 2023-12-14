import {
    query,
    asyncMap,
    evaluate,
} from 'jezve-test';
import { assert } from '@jezvejs/assert';
import { ControlledInputView } from './ControlledInputView.js';

const controlIds = [
    'inputStatus',
    'formStatus',
];

export class DateInputView extends ControlledInputView {
    inputSelectors = {
        defaultInput: '#dateinput',
        placeholderInput: '#dateInputPh',
        createdInput: '#createContainer input',
        usLocaleInput: '#usDateInput input',
        koLocaleInput: '#koDateInput input',
        ruLocaleInput: '#ruDateInput input',
        esLocaleInput: '#esDateInput input',
        testValueInput: '#testValueInput',
    };

    async parseContent() {
        const res = await super.parseContent();

        await asyncMap(controlIds, async (id) => {
            res[id] = { elem: await query(`#${id}`) };
            assert(res[id].elem, `Failed to initialize control '${id}'`);
        });

        [
            res.inputStatus.value,
            res.formStatus.value,
        ] = await evaluate((inpStatEl, formStatEl) => ([
            inpStatEl.textContent,
            formStatEl.textContent,
        ]), res.inputStatus.elem, res.formStatus.elem);

        return res;
    }

    buildModel(cont) {
        return {
            ...super.buildModel(cont),
            inputStatus: cont.inputStatus.value,
            formStatus: cont.formStatus.value,
        };
    }

    getExpectedState(model = this.model) {
        return {
            ...super.getExpectedState(model),
            inputStatus: {
                visible: true,
                value: model.inputStatus,
            },
            formStatus: {
                visible: true,
                value: model.formStatus,
            },
        };
    }
}
