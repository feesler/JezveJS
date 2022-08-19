import { InputGroup, onReady } from '../../js/index.js';
import '../../css/common.scss';
import '../css/app.scss';
import './style.scss';

const init = () => {
    const allInputs = Array.from(document.querySelectorAll('.input-group'));
    allInputs.forEach((elem) => InputGroup.fromElement(elem));
};

onReady(init);
