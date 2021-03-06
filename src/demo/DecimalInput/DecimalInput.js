import { ge, onReady, DecimalInput } from '../../js/index.js';
import '../../css/common.scss';
import '../css/common.scss';
import '../css/app.scss';

const initDefault = () => {
    DecimalInput.create({ elem: ge('decInput') });
};

const initDigitsLimit = () => {
    const dd = DecimalInput.create({
        elem: ge('decInputDigits'),
        digits: 3,
    });

    dd.value = 2;
};

const initOnlyPositive = () => {
    DecimalInput.create({
        elem: ge('decInputPositive'),
        allowNegative: false,
    });
};

const init = () => {
    initDefault();
    initDigitsLimit();
    initOnlyPositive();
};

onReady(init);
