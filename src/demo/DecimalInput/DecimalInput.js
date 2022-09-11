import { ge, onReady, DecimalInput } from '../../js/index.js';
import '../../css/common.scss';
import '../common/app.scss';
import { initNavigation } from '../common/app.js';

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

const initLeadingZeros = () => {
    DecimalInput.create({
        elem: ge('decInputZeros'),
        allowMultipleLeadingZeros: true,
    });
};

const init = () => {
    initNavigation();

    initDefault();
    initDigitsLimit();
    initOnlyPositive();
    initLeadingZeros();
};

onReady(init);
