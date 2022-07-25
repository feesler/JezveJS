import { ge, onReady } from '../../js/index.js';
import { DecimalInput } from '../../Components/DecimalInput/DecimalInput.js';
import '../../css/common.css';
import '../css/common.css';
import '../css/app.css';

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
